/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable jest/prefer-expect-assertions */
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(sinonChai);

const Payments = require('../models/payments');
const PaymentsController = require('../controllers/PaymentsController');

const mockedPayments = [
  {
    _id: '1',
    bikeid: 'bike1',
    date: new Date('2023-06-15'),
    data: {
      paidby: 'John Doe',
      mode: 'cash',
      amount: '100',
      transctid: '123456789',
    },
  },
  {
    _id: '2',
    bikeid: 'bike2',
    date: new Date('2023-06-16'),
    data: {
      paidby: 'Jane Smith',
      mode: 'mobile',
      amount: '50',
      transctid: '987654321',
    },
  },
];

// module.exports = mockedPayments;

describe('paymentsController', () => {
  describe('index', () => {
    it('should retrieve and paginate payments', async () => {
      const req = { query: { page: '1', itemsPerPage: '10' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Payments, 'find').resolves();

      await PaymentsController.index(req, res);

      expect(Payments.find).to.be.calledOnce;
      expect(res.status).to.be.calledWith(200);
      expect(res.json).to.be.calledWith({ payments: mockedPayments });

      Payments.find.restore();
    });

    it('should handle error and return 500 status', async () => {
      const req = { query: { page: '1', itemsPerPage: '10' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Payments, 'find').throws(new Error('Mocked error'));

      await PaymentsController.index(req, res);

      expect(Payments.find).to.be.calledOnce;
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: 'Internal Server Error' });

      Payments.find.restore();
    });
  });

  describe('recordPayment', () => {
    it('should create a new payment record', async () => {
      const req = {
        body: {
          bikeid: 'mockedBikeId',
          date: '2023-06-13',
          data: {
            paidby: 'mockedPaidBy',
            mode: 'cash',
            amount: '100',
            transctid: 'mockedTransctId',
          },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const saveStub = sinon.stub().yields(null, { id: 'mockedPaymentId' });
      sinon.stub(Payments.prototype, 'save').value(saveStub);
      const infoSpy = sinon.spy(console, 'log');

      await PaymentsController.recordPayment(req, res);

      expect(saveStub).to.be.calledOnce;
      expect(res.status).to.be.calledWith(201);
      expect(res.json).to.be.calledWith({ id: 'mockedPaymentId' });
      expect(infoSpy).to.be.calledWith('New payment record: mockedPaymentId');

      Payments.prototype.save.restore();
      infoSpy.restore();
    });

    it('should handle error and return 500 status', async () => {
      const req = {
        body: {
          bikeid: 'mockedBikeId',
          date: '2023-06-13',
          data: {
            paidby: 'mockedPaidBy',
            mode: 'cash',
            amount: '100',
            transctid: 'mockedTransctId',
          },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Payments.prototype, 'save').yields(new Error('Mocked error'));
      const errorSpy = sinon.spy(console, 'log');

      await PaymentsController.recordPayment(req, res);

      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({ error: 'Internal Server Error' });
      expect(errorSpy).to.be.calledWith('payment record creation failed: Mocked error');

      Payments.prototype.save.restore();
      errorSpy.restore();
    });
  });
});
