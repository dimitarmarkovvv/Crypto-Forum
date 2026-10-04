import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

function DeleteCommentDialog({
    commentToDelete,
    setCommentToDelete,
    handleDeleteComment,
}) {
    return (
        <Dialog.Root
            open={commentToDelete !== null}
            onOpenChange={(details) => {
                if (!details.open) {
                    setCommentToDelete(null);
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Delete comment?
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                onClick={() => setCommentToDelete(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                colorPalette="red"
                                onClick={handleDeleteComment}
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

export default DeleteCommentDialog;