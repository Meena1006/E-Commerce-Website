import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import StripePage from "../StripePage/StripePage"

const CheckOutpg = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [flag, setflag] = useState(false);


    const handleSave = () => {
        // Handle saving shipping details logic here
        // For example, you can send data to backend or handle state in parent component
        console.log(`Shipping details saved: Name - ${name}, Address - ${address}, Phone Number - ${phoneNumber}`);
        setflag(true)
        // onClose(); // Close dialog after saving
    };

    return (
        <div>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Enter Shipping Details</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Address"
                    type="text"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    Proceed
                </Button>
            </DialogActions>
            <div >
            {flag && <StripePage />}
            </div>
            
        </Dialog>
            
            </div>
    );
};


export default CheckOutpg