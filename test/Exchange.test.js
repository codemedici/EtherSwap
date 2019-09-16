import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
	let token
  	let exchange
  	const feePercent = 10

	beforeEach(async () => {
		token = await Token.new()
	    token.transfer(user1, tokens(100), { from: deployer })
	    exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {

  		it('tracks the fee account', async () => {
      		const result = await exchange.feeAccount()
      		result.should.equal(feeAccount)
    	})

    	it('tracks the fee percent', async () => {
      		const result = await exchange.feePercent()
      		result.toString().should.equal(feePercent.toString())
    	})

  	})

	describe('depositing tokens', () => {
	  	let result
	    let amount

	    describe('success', () => {
	      
	      	beforeEach(async () => {
	        	amount = tokens(10)
	        	await token.approve(exchange.address, amount, { from: user1 })
	        	result = await exchange.depositToken(token.address, amount, { from: user1 })
	      	})

	      	it('tracks the token deposit', async () => {
	        	// Check exchange token balance
	        	let balance
	        
	        	balance = await token.balanceOf(exchange.address) // the balance of the exchange in Tokens
	        	balance.toString().should.equal(amount.toString())
	      	
	      		balance = await exchange.tokens(token.address, user1) // the balance of the user on the exchange in tokens
	        	balance.toString().should.equal(amount.toString())

	      	})

	      	it('emits a Deposit event', async () => {
	      		const log = result.logs[0]
	      		log.event.should.equal('Deposit')
	      		const event = log.args
	      		event.token.should.equal(token.address, 'token address correct')
	      		event.user.should.eq(user1, 'user correct')
	      		event.amount.toString().should.eq(amount.toString(), 'user balance correct')
	      		event.balance.toString().should.eq(amount.toString(), 'user balance correct')
	      	})

	    })

	    describe('failure', () => {

	      	it('fails when depositing tokens without calling token.approve() first', async () => {
	      		await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
	      	})

	      	it('rejects Ether deposits', async () => {
	      		// I'm not sure why we are testing for address of token being different from 0x000..
	      		// that null address is the default used in order to burn tokens and no one owns it.
	      		// it will fail because there is no erc20 token at address 0x0
	      		await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
	      	})

	    })
	})

	describe('depositing Ether', () => {
		let result
		let amount

		beforeEach( async () => {
			amount = tokens(1)
			result = await exchange.depositEther({from: user1, value: amount})
		})

		it('tracks the Ether deposit', async () => {
			// checking that user1's ether balance gets updated
	      	const balance = await exchange.tokens(ETHER_ADDRESS,user1)
	      	balance.toString().should.eq(amount.toString())

	      	//checking the ether storage at the contract's address
	      	const exchangeBalance = await web3.eth.getBalance(exchange.address);
	      	exchangeBalance.toString().should.eq(amount.toString())
	    })

    	it('emits a Deposit event', async () => {
      		const log = result.logs[0]
      		log.event.should.equal('Deposit')
      		const event = log.args
      		event.token.should.equal(ETHER_ADDRESS, 'Ether address correct')
      		event.user.should.eq(user1, 'user correct')
      		event.amount.toString().should.eq(amount.toString(), 'user balance correct')
      		event.balance.toString().should.eq(amount.toString(), 'user balance correct')
      	})
	})

	describe('fallback', () => {
		it('reverts if ether is sent', async () => {
			// wtf why is the transaction reverted when I still haven't written any fallback function yet
			await exchange.sendTransaction({from:user1, value:tokens(1)}).should.be.rejectedWith(EVM_REVERT)

			// balance should be 0 eth because tx gets reverted
			const exchangeBalance = await web3.eth.getBalance("0x1A5Ce2cfF4cA883792A9531dA2B921731f956E33");
	      	exchangeBalance.toString().should.eq('0')

		})
	})
})




















