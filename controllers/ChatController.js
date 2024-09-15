const Coordenador = require('../models/Coordenador');
const Curso = require('../models/Curso');
const Professor = require('../models/Professor');
const DisciplinaCurso = require('../models/disciplinaCurso');
const Disciplina = require('../models/Disciplina');

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

    static async Chat(req, res) {
        try {
            const { coordenador_id, professor_id } = req.params;
            res.render('chat/chat', { coordenador_id, professor_id });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'deu pau' });
        }
    }
}