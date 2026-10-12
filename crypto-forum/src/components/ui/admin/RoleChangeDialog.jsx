import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

const ROLE_LABELS = {
    user: 'User',
    moderator: 'Moderator',
    admin: 'Admin',
};

const ROLE_DESCRIPTIONS = {
    user: 'Keeps their posts and comments, but loses every moderation right.',
    moderator: 'Can edit and delete any post or comment, but cannot reach the admin dashboard, block users or change roles.',
    admin: 'Can edit and delete any post or comment, block users and change roles, including yours.',
};

function RoleChangeDialog({
    roleChange,
    setRoleChange,
    handleConfirmRoleChange,
}) {
    const nextRole = roleChange?.nextRole;
    const demoting = nextRole === 'user';

    return (
        <Dialog.Root
            open={roleChange !== null}
            onOpenChange={(details) => {
                if (!details.open) {
                    setRoleChange(null);
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Change role to {ROLE_LABELS[nextRole]}?
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text>
                                <strong>{roleChange?.user?.username}</strong>
                                {' is currently '}
                                {ROLE_LABELS[roleChange?.user?.role]}
                                {' and will become '}
                                {ROLE_LABELS[nextRole]}.
                            </Text>

                            <Text mt={2} color="fg.muted">
                                {ROLE_DESCRIPTIONS[nextRole]}
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                onClick={() => setRoleChange(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                colorPalette={demoting ? 'red' : 'brand'}
                                onClick={handleConfirmRoleChange}
                            >
                                Change Role
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default RoleChangeDialog;