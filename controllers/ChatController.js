const Coordenador = require('../models/Coordenador');
const Curso = require('../models/Curso');
const Professor = require('../models/Professor');
const DisciplinaCurso = require('../models/disciplinaCurso');
const Disciplina = require('../models/Disciplina');
const Chat = require('../models/Chat');
const { Op } = require('sequelize');

require('dotenv').config()

module.exports = class ChatController {

    static async IndexCoordenador(req, res) {
        try {
            const coordenador = await Coordenador.findOne({ raw: true, where: { usuario_id: req.user.id } });

            const cursos = await Curso.findAll({ raw: true, where: { coordenador_id: coordenador.coordenador_id } });
            const cursos_id = cursos.map((curso) => curso.curso_id);
            const coordenador_id = cursos.map((curso) => curso.coordenador_id);

            const disciplinaCurso = await DisciplinaCurso.findAll({ raw: true, where: { curso_id: cursos_id } });
            const discipinas_id = disciplinaCurso.map((disciplina) => disciplina.disciplina_id);
            const disciplinas = await Disciplina.findAll({ raw: true, where: { disciplina_id: discipinas_id } });

            const professor_id = disciplinas.map((disciplina) => disciplina.professor_id);
            const professores = await Professor.findAll({ raw: true, where: { professor_id: professor_id } });

            const disciplinasComProfessores = disciplinas.map((disciplina) => {
                const professor = professores.find((prof) => String(prof.professor_id) === String(disciplina.professor_id));
                console.log('Comparando disciplina:', disciplina, 'com professor:', professor); // Verificar a comparação

                return {
                    ...disciplina,
                    professor: professor ? professor : 'Professor não encontrado' // ou qualquer campo relevante do professor
                };
            });

            res.render('chat/indexCoordenador', { coordenador, disciplinasComProfessores });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'deu pau' });
        }
    }

    static async IndexProfessor(req, res){
        try{
            const professor = await Professor.findOne({ raw: true, where: { usuario_id: req.user.id } });
            const disciplina = await Disciplina.findAll({ raw: true, where: { professor_id: professor.professor_id } });
            const disciplinasId = disciplina.map((disciplina) => disciplina.disciplina_id);
            const disciplinaCurso = await DisciplinaCurso.findAll({ raw: true, where: { disciplina_id: disciplinasId } });
            const cursoId = disciplinaCurso.map((disciplinaCurso) => disciplinaCurso.curso_id);
            const cursos = await Curso.findAll({ raw: true, where: { curso_id: cursoId } });
            const coordenadoresId = cursos.map((curso) => curso.coordenador_id);
            const coordenadores = await Coordenador.findAll({ raw: true, where: { coordenador_id: coordenadoresId } });

            const cursosComCoordenadores = cursos.map((curso) => {
                const coordenador = coordenadores.find((coord) => String(coord.coordenador_id) === String(curso.coordenador_id));
                return {
                    ...curso,
                    coordenador: coordenador ? coordenador : 'Coordenador não encontrado' // ou qualquer campo relevante do coordenador
                };
            });

            console.log('Cursos com coordenadores:', cursosComCoordenadores);
            res.render('chat/indexProfessor', {cursos, professor, cursosComCoordenadores});
        }catch(err){
            console.log(err);
            res.status(500).json({ message: 'deu pau' });
        }
    }

    static async Chat(req, res) {
        try {
            const { coordenador_Userid, professor_Userid } = req.params;
            const userId = req.user.id
            console.log(req.user.id);
            const professor = await Professor.findOne({ raw: true, where: { usuario_id: req.user.id } });
            const coordenador = await Coordenador.findOne({ raw: true, where: { usuario_id: req.user.id } });
            //console.log(coordenador.coordenador_id);
            let user = null
            let userRole = null


            if (professor) {
                userRole = 'professor'
                user = professor
            } else if (coordenador) {
                userRole = 'coordenador'
                user = coordenador
            } else {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            //console.log('Mensagens:', messages);
            res.render('chat/chat', { coordenador_Userid, professor_Userid, user, userRole, professor, coordenador, userId });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'deu pau' });
        }
    }

    static async GetMessages(remetente_id, destinatario_id) {
        try {
            const msgs = await Chat.findAll({
                raw: true,
                where: {
                    [Op.or]: [
                        { remetente_id, destinatario_id },
                        { remetente_id: destinatario_id, destinatario_id: remetente_id }
                    ]
                },
                order: [['data_envio', 'ASC']]
            });
            return msgs;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    static configureSocketIO(io) {
        io.on('connection', (socket) => {
            console.log('Novo usuário conectado');

            socket.on('joinRoom', async ({ coordenadorUserId, professorUserId }) => {
                const roomName = `chat_${coordenadorUserId}_${professorUserId}`;
                socket.join(roomName);

                try {
                    const messages = await ChatController.GetMessages(coordenadorUserId, professorUserId);
                    socket.emit('previousMessages', messages);
                } catch (err) {
                    console.log(err);
                }
            });

            socket.on('chatMessage', async ({ remetente_id, destinatario_id, message, coordenadorUserId, professorUserId }) => {
                const roomName = `chat_${coordenadorUserId}_${professorUserId}`;
                io.to(roomName).emit('chatMessage', message); // Envia a mensagem para todos na sala

                await Chat.create({
                    remetente_id,
                    destinatario_id,
                    message,
                });
            })

            socket.on('previousMessages', async ({ remetente_id, destinatario_id }) => {
                const messages = await ChatController.GetMessages(remetente_id, destinatario_id);
                socket.emit('previousMessages', messages);
            })

            socket.on('disconnect', () => {
                console.log('Usuário desconectado');
            })
        });
    }
}