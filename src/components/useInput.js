import React, { useState } from 'react';

function useInput(props) {
    const [value, setValue] = useState(props)
    return {
        value,
        setValue,
        reset: () => setValue(""),
        bind: {
            value,
            onChange: (event) => {
                setValue(event.target.value.trim());
            },
            required: true,
        },
    };
}

export default useInput;