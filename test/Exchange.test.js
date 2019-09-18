import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
	let token
  	let exchange
  	const feePercent = 10

	beforeEach(async () => {
		token = await Token.new()
	    await token.transfer(user1, tokens(100), { from: deployer })
	    exchange = await Exchange.new(feeAccount, feePercent)
	})

	// describe('fallback', () => {
	// 	it('reverts if ether is sent', async () => {
	// 		// why does the transaction revert even though I still haven't written any fallback function yet!?
	// 		await exchange.sendTransaction({from: user1, value:tokens(1)}).should.be.rejectedWith(EVM_REVERT)
	// 	})
	// })	

	// describe('deployment', () => {

 //  		it('tracks the fee account', async () => {
 //      		const result = await exchange.feeAccount()
 //      		result.should.equal(feeAccount)
 //    	})

 //    	it('tracks the fee percent', async () => {
 //      		const result = await exchange.feePercent()
 //      		result.toString().should.equal(feePercent.toString())
 //    	})
 //  	})

	// describe('depositing tokens', () => {
	//   	let result
	//     let amount

	//     describe('success', () => {
	      
	//       	beforeEach(async () => {
	//         	amount = tokens(10)
	//         	await token.approve(exchange.address, amount, { from: user1 })
	//         	result = await exchange.depositToken(token.address, amount, { from: user1 })
	//       	})

	//       	it('tracks the token deposit', async () => {
	//         	// Check exchange token balance
	//         	let balance
	        
	//         	balance = await token.balanceOf(exchange.address) // the balance of the exchange in Tokens
	//         	balance.toString().should.equal(amount.toString())
	      	
	//       		balance = await exchange.tokens(token.address, user1) // the balance of the user on the exchange in tokens
	//         	balance.toString().should.equal(amount.toString())

	//       	})

	//       	it('emits a Deposit event', async () => {
	//       		const log = result.logs[0]
	//       		log.event.should.equal('Deposit')
	//       		const event = log.args
	//       		event.token.should.equal(token.address, 'token address correct')
	//       		event.user.should.eq(user1, 'user correct')
	//       		event.amount.toString().should.eq(amount.toString(), 'user balance correct')
	//       		event.balance.toString().should.eq(amount.toString(), 'user balance correct')
	//       	})

	//     })

	//     describe('failure', () => {

	//       	it('fails when depositing tokens without calling token.approve() first', async () => {
	//       		await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
	//       	})

	//       	it('rejects Ether deposits', async () => {
	//       		// I'm not sure why we are testing for address of token being different from 0x000..
	//       		// that null address is the default used in order to burn tokens and no one owns it.
	//       		// it will fail because there is no erc20 token at address 0x0
	//       		await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
	//       	})

	//     })
	// })

	// describe('withdrawing tokens', () => {
	// 	let result
	// 	let amount

	// 	describe('success', () => {
			
	// 		beforeEach( async () => {
	// 			amount = tokens(100) // deposit all of user1's tokens to exchange
	//         	await token.approve(exchange.address, amount, { from: user1 })
	//         	await exchange.depositToken(token.address, amount, { from: user1 })
	//         	// withdraw all of user1's tokens from exchange
	// 			result = await exchange.withdrawToken(token.address, tokens(100), {from: user1})
	// 		})

	// 		it('tracks token withdrawals', async () => {
	// 			let balance
	// 			// exchange balance for user1 should be 0
	// 			balance = await exchange.tokens(token.address, user1)
	// 			balance.toString().should.equal('0')
	// 			// user1 balance should be 100
	// 			balance = await token.balanceOf(user1)
	// 			balance.toString().should.eq(amount.toString())
	// 		})


	// 		it('emits a Withdrawal event', async () => {
	//       		const log = result.logs[0]
	//       		log.event.should.equal('Withdrawal')
	//       		const event = log.args
	//       		event.token.should.equal(token.address, 'token address correct')
	//       		event.user.should.eq(user1, 'user correct')
	//       		event.amount.toString().should.eq(amount.toString(), 'withdrawal amount correct')
	//       		event.balance.toString().should.eq('0', 'user balance correct')
	//       	})
	// 	})

	// 	describe('failure', () => {
	// 		it('rejects insufficient tokens tranfer', async () => {
	// 			// user1 hasn't approved/deposited any tokens yet so any amout gets rejected
	// 			await exchange.withdrawToken(token.address, tokens(1), {from: user1}).should.be.rejectedWith(EVM_REVERT)
	// 		})

	// 	})
	// })

	// describe('depositing Ether', () => {
	// 	let result
	// 	let amount

	// 	beforeEach( async () => {
	// 		amount = tokens(1)
	// 		result = await exchange.depositEther({from: user1, value: amount})
	// 	})

	// 	it('tracks the Ether deposit', async () => {
	// 		// checking that user1's ether balance gets updated
	//       	const balance = await exchange.tokens(ETHER_ADDRESS,user1)
	//       	balance.toString().should.eq(amount.toString())

	//       	//checking the ether storage at the contract's address
	//       	const exchangeBalance = await web3.eth.getBalance(exchange.address);
	//       	exchangeBalance.toString().should.eq(amount.toString())
	//     })

 //    	it('emits a Deposit event', async () => {
 //      		const log = result.logs[0]
 //      		log.event.should.equal('Deposit')
 //      		const event = log.args
 //      		event.token.should.equal(ETHER_ADDRESS, 'Ether address correct')
 //      		event.user.should.eq(user1, 'user correct')
 //      		event.amount.toString().should.eq(amount.toString(), 'user balance correct')
 //      		event.balance.toString().should.eq(amount.toString(), 'user balance correct')
 //      	})
	// })

	// describe('withdrawing Ether', () => {

	// 	beforeEach( async () => {
	// 		await exchange.depositEther({from: user1, value: tokens(1)})
	// 	})

	// 	describe('success', () => {
	// 		let amount
	// 		let result

	// 		beforeEach( async () => {
	// 			amount = tokens(1)
	// 			result = await exchange.withdrawEther(amount, {from: user1})
	// 		})

	// 		it("tracks ether withdrawals", async () => {
	// 			let balance
	// 			balance = await exchange.tokens(ETHER_ADDRESS, user1)
	// 			balance.toString().should.eq('0')
	// 			// the total exchange balance should also equal 0 after tokens are being sent back to user
	// 			balance = await web3.eth.getBalance(exchange.address);
	//       		balance.toString().should.eq('0')
	// 		})

	// 		it('emits a Withdrawal event', async () => {
	//       		const log = result.logs[0]
	//       		log.event.should.equal('Withdrawal')
	//       		const event = log.args
	//       		event.token.should.equal(ETHER_ADDRESS, 'ether address correct')
	//       		event.user.should.eq(user1, 'user correct')
	//       		event.amount.toString().should.eq(amount.toString(), 'withdrawal amount correct')
	//       		event.balance.toString().should.eq('0', 'user balance correct')
	//       	})
	// 	})

	// 	describe('failure', () => {
	// 		it('rejects insufficient funds tranfer', async () => {
	// 			await exchange.withdrawEther(tokens(100), {from: user1}).should.be.rejectedWith(EVM_REVERT)
	// 		})
	// 	})
	// })

	// describe('creating orders', () => {
	// 	let result
	// 	let orderCount
	// 	let order

	// 	beforeEach( async () => {
	// 		result = await exchange.submitOrder(token.address, tokens(100), ETHER_ADDRESS, tokens(1), {from: user1})
	// 		orderCount = await exchange.orderCount()
	// 		orderCount.toString().should.eq('1')
	// 		order = await exchange.orders(orderCount)
	// 	})
		
	// 	it('creates an order', async() => {
	// 		order.user.should.eq(user1, 'user address is correct')
 //      		order.tokenGet.should.eq(token.address, 'long token')
 //      		order.tokenGive.should.eq(ETHER_ADDRESS, 'short Ether')
 //      		order.amountGet.toString().should.eq(tokens(100).toString(), 'user1 wants 100 tokens')
 //      		order.amountGive.toString().should.eq(tokens(1).toString(), 'user1 offers 1 Ether')
 //      		order.timestamp.toString().length.should.be.at.least(1, 'timestamp not null')
	// 	})

	// 	it('emits a Order event', async () => {
 //      		const log = result.logs[0]
 //      		log.event.should.equal('Order')
 //      		const event = log.args
 //      		event.id.toString().should.equal(orderCount.toString(), 'order id correct')
 //      		event.user.should.eq(user1, 'user correct')
 //      		event.tokenGet.should.eq(token.address, 'long token')
 //      		event.tokenGive.should.eq(ETHER_ADDRESS, 'short Ether')
 //      		event.amountGet.toString().should.eq(tokens(100).toString(), 'user1 wants 100 tokens')
 //      		event.amountGive.toString().should.eq(tokens(1).toString(), 'user1 offers 1 Ether')
 //      		event.timestamp.toString().length.should.be.at.least(1, 'timestamp not null')
	//     })
	// })

	describe('filling orders', () => {
		let result
		let orderCount
		// variables for checking user balances before and after order is filled
		let user1TokenBalance
		let user1EtherBalance
		let user2TokenBalance
		let user2EtherBalance

		beforeEach(async () => {
			// user1 deposits ether only
	        await exchange.depositEther({ from: user1, value: tokens(1) })
	        // user1 makes an order to buy tokens with Ether
			await exchange.submitOrder(token.address, tokens(10), ETHER_ADDRESS, tokens(1), {from: user1})
			// give some tokense to user2, that he will exchange for Ether by filling the order
	        await token.transfer(user2, tokens(100), { from: deployer })
	        // user2 approves the exchange to transfer tokens on his behalf (depositToken calls token.transferFrom() )
	        await token.approve(exchange.address, tokens(100), { from: user2 })
	        // user2 deposits tokens, i.e. exchange calls token.transferFrom() with msg.sender as from parameter
	        await exchange.depositToken(token.address, tokens(100), { from: user2 })
    	})

    	
    	describe('success', () => {
    		
    		it('fills an order', async () => {
	    			// checking that an order has been placed
	    		orderCount = await exchange.orderCount()
				orderCount.toString().should.eq('1')
				// checking that user2 owns 0 tokens (they had 100 and deposited in the exchange)
				const balance = await token.balanceOf(user2)
				balance.toString().should.eq('0')
				// checking that the allowance of exchange from user2 is 0 tokens
				const allowance = await token.allowance(user2, exchange.address)
				allowance.toString().should.eq('0')
				
				//checking balances before trade
				// user1 has 1 ether and user2 has 100 tokens
				user1TokenBalance = await exchange.tokens(token.address, user1)
				user1EtherBalance = await exchange.tokens(ETHER_ADDRESS, user1)
				user2TokenBalance = await exchange.tokens(token.address, user2)
				user2EtherBalance = await exchange.tokens(ETHER_ADDRESS, user2)
				user1TokenBalance.toString().should.eq('0')
				user1EtherBalance.toString().should.eq(tokens(1).toString())
				user2TokenBalance.toString().should.eq(tokens(100).toString())
				user2EtherBalance.toString().should.eq('0')

				result = await exchange.fillOrder(1, {from: user2})

				const orderFilled = await exchange.orderFilled(1)
	            orderFilled.should.equal(true)

	            //checking balances before trade
				// user1 has 100 tokens and user2 has 1 ether
	            user1TokenBalance = await exchange.tokens(token.address, user1)
				user1EtherBalance = await exchange.tokens(ETHER_ADDRESS, user1)
				user2TokenBalance = await exchange.tokens(token.address, user2)
				user2EtherBalance = await exchange.tokens(ETHER_ADDRESS, user2)

				user1TokenBalance.toString().should.eq(tokens(10).toString())
				user1EtherBalance.toString().should.eq('0')
				// 100 - 10 user1 and - 1 for 10% free = 89 remaining
				user2TokenBalance.toString().should.eq(tokens(89).toString())
				user2EtherBalance.toString().should.eq(tokens(1).toString())

				const feeAccountBalance = await exchange.tokens(token.address, feeAccount)
				feeAccountBalance.toString().should.eq(tokens(1).toString())

				// emits a trade event
				const log = result.logs[0]
	            log.event.should.eq('Trade')
	            const event = log.args
	            event.id.toString().should.equal('1', 'id is correct')
	            event.user.should.equal(user1, 'user is correct')
	            event.tokenGet.should.equal(token.address, 'tokenGet is correct')
	            event.amountGet.toString().should.equal(tokens(10).toString(), 'amountGet is correct')
	            event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
	            event.amountGive.toString().should.equal(tokens(1).toString(), 'amountGive is correct')
	            event.userFill.should.equal(user2, 'userFill is correct')
	            event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
	            event.feeAmount.toString().should.eq(tokens(1).toString(), 'feeAmount is correct')
	    	})
    	})

    	describe('failure', () => {

    		it('rejects invalid order ids', async () => {
          		await exchange.fillOrder(1337, { from: user2 }).should.be.rejectedWith(EVM_REVERT)
        	})

	        it('rejects already-filled orders', async () => {
	            // Fill the order
	            await exchange.fillOrder('1', { from: user2 }).should.be.fulfilled
	            // Try to fill it again
	            await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
	        })

	        it('rejects cancelled orders', async () => {
	            // Cancel the order
	            await exchange.cancelOrder('1', { from: user1 }).should.be.fulfilled
	            // Try to fill the order
	            await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
	        })
    	})
	})

	describe('canceling orders', () => {
		let result
		let orderCount
		let order
		let status

		beforeEach( async () => {
				// creating an order
				result = await exchange.submitOrder(token.address, tokens(100), ETHER_ADDRESS, tokens(1), {from: user1})
				orderCount = await exchange.orderCount()
				orderCount.toString().should.eq('1')
		})

		describe('success', () => {
			beforeEach( async () => {
				await exchange.cancelOrder(orderCount, {from:user1})
				order = await exchange.orders(orderCount)
			})

			it("cancels an order", async () => {
				status = await exchange.orderCancelled(orderCount)
				status.should.eq(true)
				// trying to cancel again the same order
				await exchange.cancelOrder(orderCount, {from: user1}).should.be.rejectedWith(EVM_REVERT)
			})

			it('emits a Cancel event', async () => {
	      		const log = result.logs[0]
	      		log.event.should.equal('Order')
	      		const event = log.args
	      		event.id.toString().should.equal(order.id.toString(), 'order id correct')
	      		event.user.should.eq(order.user, 'user correct')
	      		event.tokenGet.should.eq(order.tokenGet, 'long token')
	      		event.tokenGive.should.eq(order.tokenGive, 'short Ether')
	      		event.amountGet.toString().should.eq(order.amountGet.toString(), 'user1 wants 100 tokens')
	      		event.amountGive.toString().should.eq(order.amountGive.toString(), 'user1 offers 1 Ether')
	      		event.timestamp.toString().length.should.be.at.least(1, 'timestamp not null')
		    })
		})

		describe('failure', () => {
			it('rejects invalid order ids', async () => {
				await exchange.cancelOrder(1337,{from:user1}).should.be.rejectedWith(EVM_REVERT)
			})

			it('rejects invalid msg.sender', async () => {
				await exchange.cancelOrder(orderCount,{from:deployer}).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})
})




















