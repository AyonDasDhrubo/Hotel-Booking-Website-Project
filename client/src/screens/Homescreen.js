import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Room from '../components/room';
import moment from 'moment'
import Loader from "../components/Loader";
import Error from "../components/Error"
import 'antd/dist/reset.css'
import { DatePicker, Space } from 'antd'

const { RangePicker } = DatePicker;
const Homesceen = () => {

  const [data, setData] = useState([])
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [loading, setloading] = useState()
  const [error, seterror] = useState()
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [searchkey,setsearchkey] = useState('')
  const [type, settype] = useState('all')

  useEffect(() => {
    const fetchData = async () => {

      try {
        setloading(true)
        const { data: response } = await axios.get('/api/rooms/getallrooms');
        setData(response);
        setduplicaterooms(response);
        setloading(false)
      } catch (error) {
        seterror(true)
        console.error(error.message);
        setloading(false)
      }

    }

    fetchData();
  }, []);

  function filterByDate(dates) {
    if (!dates || dates.length !== 2) {
      console.error('Invalid dates:', dates);
      setData(duplicaterooms);
      setfromdate(undefined);
      settodate(undefined);
      return;
    }
  
    const formattedFromDate = dates[0].format('DD-MM-YYYY');
    const formattedToDate = dates[1].format('DD-MM-YYYY');
    setfromdate(formattedFromDate);
    settodate(formattedToDate);
  
    const temprooms = duplicaterooms.filter(room => {
      
      const isRoomAvailable = room.currentbookings.every(booking => {
        const bookingStart = moment(booking.fromdate, 'DD-MM-YYYY');
        const bookingEnd = moment(booking.todate, 'DD-MM-YYYY');
        const selectedStart = moment(formattedFromDate, 'DD-MM-YYYY');
        const selectedEnd = moment(formattedToDate, 'DD-MM-YYYY');
  
        
        return !(selectedStart.isBetween(bookingStart, bookingEnd, undefined, '[]') ||
                 selectedEnd.isBetween(bookingStart, bookingEnd, undefined, '[]') ||
                 bookingStart.isBetween(selectedStart, selectedEnd, undefined, '[]') ||
                 bookingEnd.isBetween(selectedStart, selectedEnd, undefined, '[]'));
      });
  
      return isRoomAvailable;
    });
  
    setData(temprooms);
  }
  
  function filterBySearch(){
    const temprooms = duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
    setData(temprooms)
  }

  function filterByType(e){
    settype(e)
    if(e!='all'){
      const temprooms = duplicaterooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
    setData(temprooms)
    }
    else{
      setData(duplicaterooms)
    }
  }

  return (
    <div className='container'>
      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
        <div className='col-md-5'>
          <input type='text' className='form-control' placeholder='Search Rooms'
          value = {searchkey} onChange = {(e)=>{setsearchkey(e.target.value)}} onKeyUp = {filterBySearch} />
        </div>
        <div className='col-md-3'>
        <select className='form-control' value={type} onChange={(e)=>filterByType(e.target.value)}>
          <option value="all">All</option>
          <option value="delux">Delux</option>
          <option value="non-delux">Non-Delux</option>
        </select>
        </div>
      </div>
      <div className="row-justify-content-center mt-5">
        {loading ? (<Loader/>) : error ? <Error/> : (data.map((data) => {
          return <div className="com-md-9 mt-2">
            <Room data={data} fromdate={fromdate} todate={todate} />
          </div>
        }))}
      </div>
    </div>
  )
}

export default Homesceen;