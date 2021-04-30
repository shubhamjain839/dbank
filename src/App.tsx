import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Spinner } from './components/Spinner'
import DBank from './DBank'
import web3 from './web3'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signMessage } from './utils'
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Jumbotron,
  Row,
} from 'react-bootstrap'

const App = () => {
  // All state variables
  const [loading, setLoading] = useState<boolean>(false)
  const [ether, setEther] = useState<string>('')
  const [etherDeposit, setEtherDeposit] = useState<string>('')
  const [etherWithdraw, setEtherWithdraw] = useState<string>('')
  const [signature, setSignature] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [manager, setManager] = useState<string>('')
  const [accounts, setAccounts] = useState<string[]>()
  const [event, setEvent] = useState<{}>()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [payerAddress, setPayerAddress] = useState('')
  const [nonce, setNonce] = useState('')
  const [setMenu, setSetMenu] = useState(false)

  // Method to get all details about the contract
  const getDetails = async () => {
    try {
      const accounts = await web3.eth.getAccounts()
      const manager = await DBank.methods.manager().call()
      const accountBalance = web3.utils.fromWei(
        await DBank.methods.checkBalance(accounts[0]).call()
      )
      setAccountBalance(accountBalance)
      setAccounts(accounts)
      setManager(manager)
    } catch (error) {
      if (error.message === 'Provider not set or invalid')
        toast.error('Please install Metamask to Run this app')
      else toast.error('Network Error! please try again')
      console.log(error)
    }
  }

  //Method to genrate Signature
  const genrateSignature = async () => {
    if (accounts) {
      const signature = await signMessage({
        payer: accounts[0],
        reciver: recipientAddress,
        amount: web3.utils.toWei(ether),
        nonce: nonce,
      })
      if (signature) setSignature(signature)
    }
  }

  //Method to withdraw ether from account
  const onWithdrawHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (accounts) {
      try {
        setLoading(true)
        const reciept = await DBank.methods
          .withdrawBalance(web3.utils.toWei(etherWithdraw))
          .send({ from: accounts[0], gas: '3000000' })
        setEvent(reciept.events)
        toast.info('Withdrawn')
        setEtherWithdraw('')
        setLoading(false)
      } catch (error) {
        if (error.message === 'Provider not set or invalid')
          toast.error('Please install Metamask to Run this app')
        toast.error('Failed To Transact Try again Later')
        setLoading(false)
      }
    }
  }

  //Method to Deposit ether to DBank
  const onDepositHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (accounts) {
      try {
        setLoading(true)
        const reciept = await DBank.methods
          .depositBalance()
          .send({ from: accounts[0], value: web3.utils.toWei(etherDeposit) })
        setEtherDeposit('')
        setEvent(reciept.events)
        toast.info('Deposited')
        setLoading(false)
      } catch (error) {
        if (error.message === 'Provider not set or invalid')
          toast.error('Please install Metamask to Run this app')
        toast.error('Failed To Transact Try again Later')
        setLoading(false)
      }
    }
  }

  //Method to genrate the request por payment with the message and signature
  const genrateRecieveRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (accounts) {
      try {
        setLoading(true)
        const reciept = await DBank.methods
          .transferBalance(
            payerAddress,
            web3.utils.toWei(ether),
            nonce,
            signature
          )
          .send({ from: accounts[0], gas: '3000000' })
        setEvent(reciept.events)
        toast.info('Recieved')
        setLoading(false)
      } catch (error) {
        if (error.message === 'Provider not set or invalid')
          toast.error('Please install Metamask to Run this app')
        toast.error('Failed To Transact Try again Later')
        setLoading(false)
        console.log(error)
      }
    }
  }

  const menuToggle = () => {
    setSetMenu(!setMenu)
    setEther('')
    setRecipientAddress('')
    setPayerAddress('')
    setNonce('')
    setSignature('')
  }

  useEffect(() => {
    getDetails()
  }, [event])

  return (
    <div className='App'>
      <Container>
        <div className='d-flex flex-column justify-content-center align-items-center p-5'>
          <h1>DBank</h1>
          <h3>
            DBank. Most secure Banking system based on Ethereum Blockchain.
          </h3>
        </div>
        <Jumbotron className='App-section'>
          <Row>
            <Col>
              <Form onSubmit={onDepositHandler}>
                <FormGroup>
                  <h4>Deposit Ether</h4>
                  <FormControl
                    className='input-field'
                    placeholder='Ether'
                    value={etherDeposit}
                    onChange={(e) => setEtherDeposit(e.target.value)}
                    type='number'
                  />
                </FormGroup>
                <FormGroup className='d-flex justify-content-center'>
                  {!loading && <Button type='submit'>Deposit</Button>}
                </FormGroup>
              </Form>
            </Col>
            <Col>
              <Form onSubmit={onWithdrawHandler}>
                <FormGroup>
                  <h4>Withdraw Ether</h4>
                  <FormControl
                    className='input-field'
                    placeholder='Ether'
                    value={etherWithdraw}
                    onChange={(e) => setEtherWithdraw(e.target.value)}
                    type='number'
                  />
                </FormGroup>
                <FormGroup className='d-flex justify-content-center'>
                  {!loading && <Button type='submit'>Withdraw</Button>}
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row className='mt-5 d-flex justify-content-center '>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Col>
                  <h4>Account Balance: </h4>
                  <h5>{accountBalance} Ether</h5>
                  <h5 className='mt-4'>Your Account: </h5>
                  <h5>{accounts && accounts[0]}</h5>
                  <h6 className='mt-4'>Managed By: </h6>
                  <p>{manager}</p>
                </Col>
                {setMenu ? (
                  <Col>
                    <Form>
                      <h4>Tranfer Ether</h4>
                      <FormGroup>
                        <h6>Recipient Address</h6>
                        <FormControl
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          type='text'
                        />
                      </FormGroup>
                      <FormGroup>
                        <h6>Ether </h6>
                        <FormControl
                          value={ether}
                          onChange={(e) => setEther(e.target.value)}
                          type='number'
                        />
                      </FormGroup>
                      <FormGroup>
                        <h6>Nonce </h6>
                        <FormControl
                          value={nonce}
                          onChange={(e) => setNonce(e.target.value)}
                          type='number'
                        />
                      </FormGroup>
                      <FormGroup>
                        <Button onClick={genrateSignature}>
                          Generate Signature
                        </Button>
                      </FormGroup>
                    </Form>
                    {signature && (
                      <FormGroup>
                        <FormControl
                          type='text'
                          readOnly
                          defaultValue={signature}
                        />
                        <Button onClick={() => setSignature('')}>CLEAR</Button>
                      </FormGroup>
                    )}
                    <FormGroup>
                      <p className='Link' onClick={menuToggle}>
                        Recieve Ether instead?
                      </p>
                    </FormGroup>
                  </Col>
                ) : (
                  <Col>
                    <Form onSubmit={genrateRecieveRequest}>
                      <h4>Recieve Ether</h4>
                      <FormGroup>
                        <h6>Sender Address</h6>
                        <FormControl
                          value={payerAddress}
                          onChange={(e) => setPayerAddress(e.target.value)}
                          type='text'
                        />
                      </FormGroup>
                      <FormGroup>
                        <h6>Ether </h6>
                        <FormControl
                          value={ether}
                          onChange={(e) => setEther(e.target.value)}
                          type='number'
                        />
                      </FormGroup>
                      <FormGroup>
                        <h6>Nonce </h6>
                        <FormControl
                          value={nonce}
                          onChange={(e) => setNonce(e.target.value)}
                          type='number'
                        />
                      </FormGroup>
                      <FormGroup>
                        <h6>Signature</h6>
                        <FormControl
                          type='text'
                          value={signature}
                          onChange={(e) => setSignature(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Button type='submit'>Send Request</Button>
                      </FormGroup>
                    </Form>

                    <FormGroup>
                      <p className='Link' onClick={menuToggle}>
                        Send Ether instead?
                      </p>
                    </FormGroup>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Jumbotron>
        <ToastContainer />
      </Container>
    </div>
  )
}

export default App
