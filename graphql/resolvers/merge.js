const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');

const {dateToString} = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {//use for collection
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {//use for collection
    return User.find({_id: {$in: userIds}});
});

const events = async eventIds =>{

    try{
        const events = await Event.find({_id: {$in: eventIds}});

        return events.map(event => {
            return transformEvent(event);
        });
    }
    catch(err){
        throw err;
    }
}

const singleEvent = async eventId =>{
    try{
        //const event = await Event.findById(eventId); //old

        //return transformEvent(event);                //old

        const event = await eventLoader.load(eventId.toString());//has transformEvent
        
        return event;
    }
    catch(err){
        throw err;
    }
}

const user = async userId =>{

    try{
        const user = await userLoader.load(userId.toString()); //User.findById(userId);
    
        return {
            ...user._doc, 
            _id: user.id,

            //events.bind(this, user._doc.createEvents) //old
            //createEvents: eventLoader.load.bind(this, user._doc.createEvents) //not work only refer to the func not the file
            createEvents: () => eventLoader.loadMany(user._doc.createEvents)
        }
    }
    catch(err){
        throw err;
    }
}

const transformEvent = event =>{

    return {
        ...event._doc, 
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

const transformBooking = booking =>{

    return {
        ...booking._doc, 
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;