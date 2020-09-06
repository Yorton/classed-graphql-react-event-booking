import React, {Component} from 'react';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

class BookingsPage extends Component{

    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    };

    static contextType = AuthContext;

    componentDidMount(){

        this.fetchBookings();
    }

    fetchBookings = () => {

        this.setState({isLoading: true});

        const requestBody = {
            query: `
                query {
                    bookings{
                        _id
                        createdAt
                        event{
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        };

        const token = this.context.token;
    
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }

            return res.json();
        })
        .then(resData =>{
  
            const bookings = resData.data.bookings;
            this.setState({bookings: bookings, isLoading: false});
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }


    deleteBookingHandler = bookingId =>{

        this.setState({isLoading: true});

        //old
        // const requestBody = {
        //     query: `
        //         mutation {
        //             cancelBooking(bookingId: "${bookingId}"){
        //                 _id
        //                 title
        //             }
        //         }
        //     `
        // };

        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        };

        const token = this.context.token;
    
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201){
                throw new Error('Failed!');
            }

            return res.json();
        })
        .then(resData =>{
    
            this.setState(preState => {

                const updatedBookings = preState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                });

                return {bookings: updatedBookings, isLoading: false};
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }

    changeOutputTypeHandler = outputType => {
    
        if (outputType === 'list'){
            this.setState({outputType: 'list'});
        }else{
            this.setState({outputType: 'chart'});
        }
    }

    render(){

        let content = <Spinner/>;
        if (!this.state.isLoading ){
            content = (
                <React.Fragment>
                    <BookingControls activeOutputType={this.state.outputType}
                    onChange={this.changeOutputTypeHandler}
                    />
                    <div>
                       {
                           this.state.outputType === 'list'
                           ? 
                           (
                                <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}/>
                           )
                           :
                           (
                                <BookingChart bookings={this.state.bookings}/>
                           )
                       }
                    </div>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default BookingsPage;