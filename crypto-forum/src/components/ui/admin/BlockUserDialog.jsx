import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

function BlockUserDialog({
    userToBlock,
    setUserToBlock,
    handleConfirmBlock,
}) {
    return (
        <Dialog.Root
            open={userToBlock !== null}
            onOpenChange={(details) => {
                if (!details.open) {
                    setUserToBlock(null);
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Block user?
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Are you sure you want to block{' '}
                                <strong>
                                    {userToBlock?.username}
                                </strong>
                                ?
                            </Text>

                            <Text mt={2} color="fg.muted">
                                This user will no longer be able to create
                                posts or comments until they are unblocked.
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                onClick={() => setUserToBlock(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                colorPalette="red"
                                onClick={handleConfirmBlock}
                            >
                                Block User
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default BlockUserDialog;