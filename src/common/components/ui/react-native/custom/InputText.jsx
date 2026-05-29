import React, { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { styles } from '../../../../../styles';

export default function InputText({ style, ...props }) {

    return (

        <TextInput
            style={[styles.inputBasic, style]}
            {...props}
        />
    );
}