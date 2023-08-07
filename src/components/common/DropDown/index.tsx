import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface Props {
    label?: string;
    display?: string;
    onChange?: (value: string) => void;
}

const Dropdown: React.FC<Props> = ({ label = "", display, onChange }) => {
    const [selectedValue, setSelectedValue] = useState<string>(display || "");

    const handleChange = (event: any) => {
        const value = event.target.value as string;
        setSelectedValue(value);
        if (onChange) onChange(value);
    };

    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedValue}
          onChange={handleChange}
          label={label}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderRadius: '0px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderRadius: '0px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
                borderRadius: '0px',
            },
        }}
        >
          <MenuItem value={"chat"}>Chat</MenuItem>
          <MenuItem value={"queue"}>Queue</MenuItem>
          <MenuItem value={"history"}>History</MenuItem>
          <MenuItem value={"messages"}>Messages</MenuItem>
        </Select>
      </FormControl>
    );
}

export default Dropdown;