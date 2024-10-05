const { raw } = require('mysql2');
const moment = require('moment');
const { Op, fn, col } = require('sequelize');
const Questionario = require('../models/Questionario');
const QuestionarioDisponibilizado = require('../models/QuestionarioDisponibilizado');
const AlunoDisciplina = require('../models/AlunoDisciplina');
const QuestionarioAluno = require('../models/QuestionarioAluno');
const QuestionarioCurso = require('../models/QuestionarioCurso');
const Aluno = require('../models/Aluno');
const Disciplina = require('../models/Disciplina');
const DisciplinaCurso = require('../models/DisciplinaCurso');
const Respostas = require('../models/Respostas');
const RespostasCurso = require('../models/RespostasCurso');
const Curso = require('../models/Curso');
const Professor = require('../models/Professor');
const Coordenador = require('../models/Coordenador');

require('dotenv').config()

module.exports = class QuestionarioController {
    static CriarQuestionario(req, res) {
        res.render('questionario/criarQuestionario');
    }

    static async Index(req, res) {
        try {
            const questionarios = await Questionario.findAll({ raw: true });
            res.render('questionario/index', { questionarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar questionarios' });
        }
    }

    static async IndexAluno(req, res) {
        try {
            const user = req.user;
            const aluno = await Aluno.findOne({ raw: true, where: { usuario_id: user.id } });

            const questionarioAluno = await QuestionarioAluno.findAll({ raw: true, where: { aluno_id: aluno.aluno_id, flagRespondido: false } });

            const disciplinasId = questionarioAluno.map((questionario) => questionario.disciplina_id);
            const disciplina = await Disciplina.findAll({ raw: true, where: { disciplina_id: disciplinasId } });
            const dadosCombinados = disciplina.map(disciplina => {
                const questionario = questionarioAluno.find(q => q.disciplina_id === disciplina.disciplina_id);
                return {
                    disciplina,
                    questionarioAluno: questionario
                };
            });

            const questionarioCurso = await QuestionarioCurso.findAll({ raw: true, where: { aluno_id: aluno.aluno_id, flagRespondido: false } });
            const cursosId = questionarioCurso.map((questionario) => questionario.curso_id);
            const curso = await Curso.findAll({ raw: true, where: { curso_id: cursosId } });
            const dadosCombinadosCurso = curso.map(curso => {
                const questionarioCursos = questionarioCurso.find(q => q.curso_id === curso.curso_id);
                return {
                    curso,
                    questionarioCurso: questionarioCursos
                }
            })
            req.session.dadosCombinados = dadosCombinados;
            req.session.dadosCombinadosCurso = dadosCombinadosCurso;
            res.render('questionario/indexQuestionariosNaoRespondidos', { dadosCombinados, dadosCombinadosCurso });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async IndexQuestionarioDisponivel(req, res) {
        try {
            const questionariosDisponiveis = await QuestionarioDisponibilizado.findAll({ raw: true, where: { flagDisponivel: true } });

            res.render('questionario/indexQuestionariosAtivos', { questionariosDisponiveis });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async IndexQuestionarioFinalizado(req, res) {
        try {
            const questionariosFinalizados = await QuestionarioDisponibilizado.findAll({ raw: true, where: { flagDisponivel: false } });
            res.render('questionario/indexQuestionariosInativos', { questionariosFinalizados });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async IndexQuestionarioFinalizadoProfessor(req, res) {
        try {
            const questionariosFinalizados = await QuestionarioDisponibilizado.findAll({
                raw: true,
                where: { flagDisponivel: false }
            });

            const professor = await Professor.findOne({
                raw: true,
                where: { usuario_id: req.user.id },
                attributes: ['professor_id']
            });

            const disciplinas = await Disciplina.findAll({
                raw: true,
                where: { professor_id: professor.professor_id }
            });

            const respostasComNome = await QuestionarioController.ObterDadosIndexProfessor(disciplinas);
            console.log(respostasComNome);
            res.render('questionario/indexQuestionariosInativosProfessor', { disciplinas, respostas: respostasComNome });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }

    static async IndexQuestionarioFinalizadoCoordenador(req, res) {
        try {
            const coordenador = await Coordenador.findOne({ raw: true, where: { usuario_id: req.user.id } });
            const curso = await Curso.findAll({ raw: true, where: { coordenador_id: coordenador.coordenador_id } });
            const disciplinas = await DisciplinaCurso.findAll({ raw: true, where: { curso_id: curso.map(curso => curso.curso_id) } });

            console.log(disciplinas);
            const respostas = await RespostasCurso.findAll({
                raw: true,
                where: {
                    curso_id: {
                        [Op.in]: curso.map(curso => curso.curso_id)
                    }
                },
                group: ['curso_id', 'operacao_id'],
            });

            const cursoNome = await Curso.findAll({
                raw: true,
                attributes: ['nome', 'curso_id'],
                where: {
                    curso_id: {
                        [Op.in]: curso.map(curso => curso.curso_id)
                    }
                }
            });

            const cursoMap = {};
            cursoNome.forEach(curso => {
                cursoMap[curso.curso_id] = curso.nome;
            });

            const respostasComNomeCurso = respostas.map(resposta => ({
                ...resposta,
                curso_nome: cursoMap[resposta.curso_id] || 'Nome não encontrado'
            }));

            const respostasComNomeDisciplina = await QuestionarioController.ObterDadosIndexProfessor(disciplinas);
            res.render('questionario/indexQuestionariosInativosCoordenador', { respostasCurso: respostasComNomeCurso, respostasDisciplinas: respostasComNomeDisciplina });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }

    static async FinalizarQuestionario(req, res) {
        try {
            const id = req.params.id;
            await QuestionarioDisponibilizado.update({ flagDisponivel: false }, { where: { id } });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao finalizar questionario' });
        }
    }

    static async ResponderQuestionario(req, res) {
        try {
            const questionario_id = Number(req.params.operacao_id);
            const disciplina_id = Number(req.params.disciplina_id);

            const questionario = await Questionario.findOne({ raw: true, where: { questionario_id } });
            const dadosCombinados = req.session.dadosCombinados;
            console.log(dadosCombinados);
            if (!dadosCombinados) {
                return res.status(500).json({ message: 'Não foi possível encontrar os dados combinados' });
            } else {
                const dadosFiltrados = dadosCombinados.find(dado => dado.questionarioAluno.disciplina_id === disciplina_id);
                res.render('questionario/responderQuestionario', { questionario, dadosFiltrados });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async ResponderQuestionarioCurso(req, res) {
        try {
            const questionario_id = Number(req.params.id);
            const curso_id = Number(req.params.curso_id);
            const questionario = await Questionario.findOne({ raw: true, where: { questionario_id } });
            const dadosCombinadosCurso = req.session.dadosCombinadosCurso;
            console.log(dadosCombinadosCurso);
            if (!dadosCombinadosCurso) {
                return res.status(500).json({ message: 'Não foi possível encontrar os dados combinados' });
            } else {
                const dadosFiltrados = dadosCombinadosCurso.find(dado => dado.questionarioCurso.curso_id === curso_id);
                console.log(dadosFiltrados);
                res.render('questionario/responderQuestionarioCurso', { questionario, dadosFiltrados });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar questionario' });
        }
    }

    static async SalvarResposta(req, res) {
        try {
            const aluno_id = req.params.aluno_id;
            const { pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08, operacao_id, disciplina_id } = req.body;
            await Respostas.create({
                operacao_id, disciplina_id, resposta_01: pergunta01, resposta_02: pergunta02, resposta_03: pergunta03, resposta_04: pergunta04,
                resposta_05: pergunta05, resposta_06: pergunta06, resposta_07: pergunta07, resposta_08: pergunta08
            });

            await QuestionarioAluno.update({ flagRespondido: true }, {
                where: {
                    aluno_id,
                    operacao_id,
                    disciplina_id
                }
            });

            res.redirect('/questionario/index');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'deu pau aqui' });
        }
    }

    static async SalvarRespostaCurso(req, res) {
        try {
            const aluno_id = req.params.aluno_id;
            const { pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08, operacao_id, curso_id } = req.body;

            await RespostasCurso.create({
                operacao_id, curso_id, resposta_01: pergunta01, resposta_02: pergunta02, resposta_03: pergunta03, resposta_04: pergunta04,
                resposta_05: pergunta05, resposta_06: pergunta06, resposta_07: pergunta07, resposta_08: pergunta08
            });

            await QuestionarioCurso.update({ flagRespondido: true }, {
                where: {
                    aluno_id,
                    operacao_id,
                    curso_id
                }
            });

            res.redirect('/questionario/index');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'deu pau' });
        }
    }

    static async SalvarQuestionario(req, res) {
        try {
            const { nomeQuestionario, pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08 } = req.body;

            await Questionario.create({
                nome: nomeQuestionario, pergunta_01: pergunta01, pergunta_02: pergunta02, pergunta_03: pergunta03, pergunta_04: pergunta04,
                pergunta_05: pergunta05, pergunta_06: pergunta06, pergunta_07: pergunta07, pergunta_08: pergunta08
            });

            res.redirect('/questionario/index');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar questionario' });
        }
    }

    static async EditarQuestionario(req, res) {
        try {
            const id = req.params.id;
            const questionario = await Questionario.findOne({ raw: true, where: { questionario_id: id } });
            res.render('questionario/editarQuestionario', { questionario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar questionario' });
        }
    }

    static async AtualizarQuestionario(req, res) {
        try {
            const { id, nomeQuestionario, pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08 } = req.body;
            await Questionario.update({
                nome: nomeQuestionario, pergunta_01: pergunta01, pergunta_02: pergunta02, pergunta_03: pergunta03, pergunta_04: pergunta04,
                pergunta_05: pergunta05, pergunta_06: pergunta06, pergunta_07: pergunta07, pergunta_08: pergunta08
            }, { where: { questionario_id: id } });
            res.redirect('/');
        }
        catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar questionario' });
        }
    }

    static async DeletarQuestionario(req, res) {
        try {
            const id = req.params.id;

            await Questionario.destroy({ where: { questionario_id: id } });
            res.redirect('/questionario/index');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar questionario' });
        }
    }

    static async DisponibilizarQuestionario(req, res) {
        try {
            const questionarios = await Questionario.findAll({ raw: true });
            res.render('questionario/disponibilizarQuestionario', { questionarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao disponibilizar questionario' });
        }
    }

    static async SalvarDisponibilizacao(req, res) {
        try {
            const { questionario, dataFim } = req.body;
            const relacaoDisciplinas = await AlunoDisciplina.findAll({ raw: true });
            console.log(relacaoDisciplinas);

            const alunosIds = relacaoDisciplinas.map(relacao => relacao.aluno_id);

            const alunos = await Aluno.findAll({ raw: true, where: { aluno_id: alunosIds }, attributes: ['aluno_id', 'curso_id'] });

            const operacao = await QuestionarioDisponibilizado.create({ questionario_id: questionario, dataFim, flagDisponivel: true });
            for (const relacao of relacaoDisciplinas) {
                await QuestionarioAluno.create({
                    questionario_id: questionario, aluno_id: relacao.aluno_id,
                    disciplina_id: relacao.disciplina_id, operacao_id: operacao.id, flagRespondido: false
                });
            }

            for (const aluno of alunos) {
                await QuestionarioCurso.create({
                    questionario_id: questionario, aluno_id: aluno.aluno_id,
                    curso_id: aluno.curso_id, operacao_id: operacao.id, flagRespondido: false
                });
            }

            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async ObterDadosIndexProfessor(disciplinas) {
        // Corrigir a forma de pegar as respostas
        const respostas = await Respostas.findAll({
            raw: true,
            where: {
                disciplina_id: {
                    [Op.in]: disciplinas.map(disciplina => disciplina.disciplina_id)
                }
            },
            group: ['disciplina_id', 'operacao_id'],
        });

        // Corrigir o where no Disciplina
        const disciplinaNome = await Disciplina.findAll({
            raw: true,
            attributes: ['nome', 'disciplina_id'],
            where: {
                disciplina_id: {
                    [Op.in]: disciplinas.map(disciplina => disciplina.disciplina_id)
                }
            }
        });

        const disciplinaMap = {};
        disciplinaNome.forEach(disciplina => {
            disciplinaMap[disciplina.disciplina_id] = disciplina.nome;
        });

        const respostasComNome = respostas.map(resposta => ({
            ...resposta,
            disciplina_nome: disciplinaMap[resposta.disciplina_id] || 'Nome não encontrado'
        }));

        return respostasComNome;
    }

    static async ObterDadosIndexCoordenador(curso) {
        const respostas = await RespostasCurso.findAll({
            raw: true,
            where: {
                curso_id: {
                    [Op.in]: curso.map(curso => curso.curso_id)
                }
            },
            group: ['curso_id', 'operacao_id'],
        });

        const cursoNome = await Curso.findAll({
            raw: true,
            attributes: ['nome', 'curso_id'],
            where: {
                curso_id: {
                    [Op.in]: curso.map(curso => curso.curso_id)
                }
            }
        });

        const cursoMap = {};
        cursoNome.forEach(curso => {
            cursoMap[curso.curso_id] = curso.nome;
        });

        const respostasComNome = respostas.map(resposta => ({
            ...resposta,
            curso_nome: cursoMap[resposta.curso_id] || 'Nome não encontrado'
        }));

        return respostasComNome;
    }
}