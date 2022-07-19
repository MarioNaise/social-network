//// src/redux/friends/slice.js

/// a mini / sub-reducer that handles changes to the global state -
// but only specific to the friends

// friends=[] : is a property inside global state
// we're using default parameter here
export default function friendsWannabesReducer(friends = [], action) {
    if (action.type === "friends-wannabes/received") {
        friends = action.payload.friends;
    }

    if (action.type === "friends-wannabes/remove") {
        friends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return friend;
            }
        });
    }

    if (action.type === "friends-wannabes/accept") {
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
    }

    return friends;
}

export function receiveFriendsAndWannabes(friends) {
    return {
        type: "friends-wannabes/received",
        payload: { friends },
    };
}

export function makeFriend(id) {
    return {
        type: "friends-wannabes/accept",
        payload: { id },
    };
}

export function removeFriend(id) {
    return {
        type: "friends-wannabes/remove",
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
