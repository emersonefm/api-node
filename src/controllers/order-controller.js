'use restrict';

const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        let contract = new ValidationContract();
        // contract.isRequired(req.body.number, 'O número é do pedido é obrigatório');
        // contract.isRequired(req.body.createDate, 'A data do pedido é obrigatório');
        // contract.isRequired(req.body.status, 'O status do pedido é obrigatório');

        //Se os dados forem inválidos
        // if (!contract.isValid()) {
        //     res.status(400).send(contract.errors()).send();
        //     return;
        // }

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({
            message: 'Pedido cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processesar sua requisição'
        });
    }
}

