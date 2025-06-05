import React, { useState } from 'react';
import styles from './TextInput.module.css';

export default function TextInput({ placeholder = 'o que está acontecendo?', maxLength = 280, ...props }) {
    const [text, setText] = useState('');

    function onTextChange(event) {
        const value = event.target.value;
        if (value.length <= maxLength) {
            setText(value);
        }
    }

    return (
        <div>
            <textarea
                className={styles.input}
                placeholder={placeholder}
                maxLength={maxLength}
                value={text}
                onChange={onTextChange}
                {...props}
            />
            <p> {text.length} / {maxLength}</p>
        </div>
    );
}




