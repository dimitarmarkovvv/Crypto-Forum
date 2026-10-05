import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

function BlockedAccountDialog({
    open,
    onAcknowledge,
}) {
    return (
        <Dialog.Root
            open={open}
            closeOnInteractOutside={false}
            closeOnEscape={false}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Account blocked
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Your account has been blocked.
                            </Text>

                            <Text mt={2} color="fg.muted">
                                You can still browse the forum, but you
                                cannot create posts or comments until an
                                administrator unblocks your account.
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button onClick={onAcknowledge}>
                                I understand
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default BlockedAccountDialog;