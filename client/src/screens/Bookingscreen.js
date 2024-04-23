import React, { useState, useEffect } from "react";
import { json, useParams } from "react-router-dom";
import axios from "axios";
import moment from 'moment'
import Loader from "../components/Loader";
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';
function Bookingscreen({ match }) {
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState()
    const [room, setroom] = useState()
    let { roomidd } = useParams();

    let { roomid, fromDate, toDate } = useParams();
    let { fromdate, todate } = useParams();
    const firstdate = moment(fromdate, 'DD-MM-YYYY')
    const lastdate = moment(todate, 'DD-MM-YYYY')
    const totaldays = moment.duration(lastdate.diff(firstdate)).asDays() + 1
    const [totalpayment, settotalpayment] = useState()
    useEffect(() => {
        if (!localStorage.getItem('currentUser')) {
            window.location.reload = '/login'
        }
        const fetchData = async () => {
            try {
                setloading(true);
                const response = await axios.post('/api/rooms/getroombyid', { roomid: roomidd });
                settotalpayment(totaldays * response.data.rentperday)
                setroom(response.data);
                setloading(false);

            } catch (error) {
                console.error(error);
                setloading(false);
                seterror(true);
            }
        };

        fetchData();
    }, [roomidd])


    async function onToken(token) {
        console.log(token)
        const bookingDetails = {

            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totaldays,
            totalpayment,
            token
        }
        try {
            setloading(true)
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            setloading(false)
            Swal.fire("Congratulation!", "Your Room Booked Successfully", 'success').then(result => {
                window.location.href = '/bookings'
            })
        } catch (error) {
            setloading(false)
            Swal.fire("Ops!", "Something Went Wrong", 'error')
        }

    }

    return (
        <div className="m-5">
            {loading ? (<h1>Loading ....</h1>) : error ? (<h1>Error ....</h1>) : (<div>
                <div className="row justify-content-center mt-5 bs">
                    <div className="col-md-5">
                        <h1>{room.name}</h1>
                        <img src={room.imageurls[0]} className="bigimg" />
                    </div>

                    <div className="col-md-6">
                        <div style={{ textAlign: 'right' }}>
                            <h1>Booking Details</h1>

                            <b>
                                <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name} </p>
                                <p>From Date : {fromdate} </p>
                                <p>To Date : {todate} </p>
                                <p>Max Count : {room.maxcount}</p>
                            </b>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <b>
                                <h1>Amount: </h1>
                                <p>Total Days : {totaldays}</p>
                                <p>Rent Per Day : {room.rentperday}</p>
                                <p>Total Amount : {totalpayment} </p>
                            </b>

                        </div>
                        <div style={{ float: 'right' }}>

                            <StripeCheckout
                                amount={totalpayment * 100}
                                currency='BDT'
                                token={onToken}
                                stripeKey="pk_test_51P7EPYP3ZIXGXmufxwjZRR2ThzAdAWndBiNfjPefg8lBgvwVdaywY2QtBgbTKF0qlYfMRjS0mWP5UT6CjBPfGxyQ00t9Qm4SUS"

                            >
                                <button className="btn btn-primary">Pay Now {" "}</button>
                            </StripeCheckout>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
}

export default Bookingscreen;
