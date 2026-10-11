import { useState } from 'react';
import { IconButton, Input, InputGroup } from '@chakra-ui/react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

function PasswordInput(props) {
    const [visible, setVisible] = useState(false);

    return (
        <InputGroup
            endElement={
                <IconButton
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    size="xs"
                    variant="ghost"
                    tabIndex={-1}
                    onClick={() => setVisible((previous) => !previous)}
                >
                    {visible ? <LuEyeOff /> : <LuEye />}
                </IconButton>
            }
        >
            <Input {...props} type={visible ? 'text' : 'password'} />
        </InputGroup>
    );
}

export default PasswordInput;
