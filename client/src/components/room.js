import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';


function Room({ data, fromdate, todate }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className='row bs'>
            <div className='col-md-4'>
                <img src={data.imageurls[0]} className='smallimg' />
            </div>
            <div className='col-md-7 '>
                <h1>{data.name}</h1>
                <p><b>Rent Per Day :</b> {data.rentperday}</p>
                <p><b>Phone Number :</b> {data.phonenumber}</p>
                <p><b>Max Count :</b> {data.maxcount}</p>
                <p><b>Type :</b> {data.type}</p>
                <div style={{ float: 'right' }}>
                    {(fromdate && todate) && (<Link to={`/book/${data._id}/${fromdate}/${todate}`}>

                        <button className='btn btn-primary m-2'>Book Now</button>
                    </Link>)}


                    <button className='btn btn-primary' onClick={handleShow}>View Deatils</button>
                </div>
            </div>


            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{data.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Carousel>
                        {data.imageurls.map(url => {
                            return <Carousel.Item>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={url}
                                />
                            </Carousel.Item>
                        })}
                    </Carousel>
                    <p>{data.description}</p>
                </Modal.Body>
                <Modal.Footer>


                </Modal.Footer>
            </Modal>

        </div>
    )
}
export default Room;