import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

function DeletePostDialog({ open, setOpen, handleDeletePost, loading }) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) {
                    setOpen(false);
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Delete post?
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Are you sure you want to delete this post?
                                Its comments will be deleted with it, and this
                                action cannot be undone.
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                disabled={loading}
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                colorPalette="red"
                                loading={loading}
                                loadingText="Deleting..."
                                onClick={handleDeletePost}
                            >
                                Delete
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default DeletePostDialog;
