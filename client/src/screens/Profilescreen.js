import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';
const { TabPane } = Tabs;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    useEffect(() => {
        if (!user) {
            window.location.href = '/login'
        }
    }, []
    )

    return (
        <div className="mt-5 ml-3">
            <Tabs defaultActiveKey="1">
                <TabPane tab="My Profile" key="1">
                    <div className="row">
                        <div className="col-md-6 bs m-2 p-3">
                            <h1>Name : {user.name}</h1>
                            <h1>Email : {user.email}</h1>
                            <h1>Admin Access : {user.isAdmin ? "Yes" : "No"}</h1>
                            <h1>User ID : {user._id}</h1>

                        </div>
                    </div>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <h1>
                        <MyBookings />
                    </h1>
                </TabPane>
            </Tabs>

        </div>
    );
}
export default Profilescreen;

export function MyBookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()
    const user = JSON.parse(localStorage.getItem('currentUser'))
    useEffect(() => {
        async function fetchBookings() {
            try {
                setloading(true)
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                const rooms = response.data;
                console.log(rooms);
                setbookings(rooms);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(error)
            }
        }

        fetchBookings();
    }, []);
    async function cancelBooking(bookingid, roomid) {
        try {
            setloading(true);
            const result = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
            console.log(result);
            setloading(false);
    
            
            setbookings(currentBookings => currentBookings.map(booking => {
                if (booking._id === bookingid) {
                    return { ...booking, status: 'cancelled' }; 
                }
                return booking;
            }));
    
            Swal.fire("Congrats", "Your Booking Cancelled Successfully!", 'success');
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire("Ops!", "Something Went Wrong", 'error');
        }
    }
    
    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    {loading && (<Loader />)}
                    {bookings && (bookings.map(booking => {
                        return <div className='bs'>
                            <h1><b>Your Hotel: </b>{booking.room}</h1>
                            <p><b>Booking ID:</b> {booking._id}</p>
                            <p><b>Check In Date:</b> {booking.fromdate}</p>
                            <p><b>Check Out Date:</b> {booking.todate}</p>
                            <p><b>Amount Paid:</b> {booking.totalpayment}</p>
                            <p><b>Booking Status:</b> {booking.status == 'booked' ? 'Confirmed' : 'Cancelled'} </p>
                            {booking.status !== 'cancelled' && (<div className='text-right'>
                                <button className='btn btn-primary' onClick={() => { cancelBooking(booking._id, booking.roomid) }}>Cancel Booking</button>
                            </div>)}

                        </div>
                    }
                    ))}
                </div>
            </div>
        </div>

    )
}