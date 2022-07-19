//// src/redux/friends/slice.js

/// a mini / sub-reducer that handles changes to the global state -
// but only specific to the friends

// friends=[] : is a property inside global state
// we're using default parameter here
export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "friends-wannabees/received") {
        friends = action.payload.friends;
    }

    // if (action.type === "friends-wannabees/accept") {
    //     const newFriendsWannabees = friends
    //         .map
    //         // do mapping here
    //         // check if the id of the users matches the id of the user you just clicked
    //         // if it does, copy user and change accepted to true
    //         ();
    // }

    return friends;
}

export function receiveFriendsAndWannabees(friends) {
    return {
        type: "friends-wannabees/received",
        payload: { friends },
    };
}

export function makeFriend(id) {
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}

export function removeFriend(id) {
    return {
        type: "friends-wannabees/remove",
        payload: { id },
    };
}

// how to avoid mutation

// let obj = {
//     name: "Edwin",
// }

// var newObj = { ...obj}

// var newObj = {...obj, last: "Harmuth"};
// var arr =[1,2,3];
// var newArr = [...arr];
// var newArr = [...arr, 4];

// #2 MAP - works only on arrays
// useful for looping, cloning, and changing each element in the array
// returns a NEW ARRAY

// #3 filter - array method
// great for removing things
// returns a new array
