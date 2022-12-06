import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
import AuthContext from '../auth/index'

export default function LoginError() {
    const { auth } = useContext(AuthContext);
    function handleClose(event) {
        auth.removeError()
    }

    let message = auth.errorMessage
    return (
        <Modal
            open={auth.currentError}
        >
            <Alert severity="error">
                Error: <strong>{message}</strong>
                <Button variant="contained" onClick={() => handleClose()}>Close</Button>
            </Alert>
        </Modal>
    );
}

// onClose={() => handleClose()}