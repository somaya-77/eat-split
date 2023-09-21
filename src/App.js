import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({children, onClick}) {
  return <button className="button" onClick={onClick}>{children}</button>
};

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selection, setSlection] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  };

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend){
    // setSlection(friend)
    setSlection((selected) => selected?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  };

  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) => friends.map((friend) => friend.id === selection.id ? {...friend, balance: friend.balance + value} : friend));

    setSlection(null);
  }
 
  return <div className="app">
    <div className="sidebar">
      <Listfriend friends={friends} onSelection={handleSelection}  selection={selection}/>
      {showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend}  />}
      <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add friend'}</Button>
    </div>
    {selection && (<FormSplit selection={selection} handleSplitBill={handleSplitBill}
    key={selection.id}
    />)}

    
  </div>
}

function Listfriend({friends, onSelection, selection}) {
  return <ul>
    {friends.map((friend) => (
      <Friend friend={friend} key={friend.id} onSelection={onSelection} selection={selection}/>
    ))}
  </ul>
};


function Friend({friend , onSelection, selection}) {
  // check on same frind
  const isSelected = selection?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance > 0 && <p className="green">{friend.name} owes you ${Math.abs(friend.balance)}</p>}
      {friend.balance < 0 && <p className="red">You owe {friend.name} ${Math.abs(friend.balance)}</p>}
      
      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : 'Select'}</Button>
    </li>
  )
}



function FormAddFriend({handleAddFriend}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmite(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    handleAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmite}>
      <label>👭 Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>

      <label>📷 Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)}/>

      <Button>Add</Button>

    </form>
  );
};

function FormSplit({selection , handleSplitBill}) {
  const [bill , setBill] = useState('');
  const [expense , setExpense] = useState('');
  const isPayedBy = bill ? bill - expense : '';
  const [paying , setPaying] = useState('user');

  function handleSubmitBill(e) {
    e.preventDefault();

    if(!bill || !expense) return;
    handleSplitBill(paying === "user" ? isPayedBy : -expense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitBill}>
        <h2>Split a bill with {selection.name}</h2>

        <label>💰 Bill value</label>
        <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))}/>

        <label>🧍‍♂️ Your expense</label>
        <input type="text" value={expense} onChange={(e) => setExpense(
          Number(e.target.value) > bill ? expense : Number(e.target.value))}/>

        <label>👭 {selection.name}'s expense</label>
        <input type="text" disabled value={isPayedBy} />

        <label>🤑 Who is paying the bill</label>

        <select value={paying} onChange={(e) => setPaying(e.target.value)}>
          <option value='user'>You</option>
          <option value='friend'>{selection.name}</option>
        </select>

        <Button>Split bill</Button>
    </form>
  )
}