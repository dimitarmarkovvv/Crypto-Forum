import { Alert } from '@chakra-ui/react';

function BlockedAccountBanner() {
  return (
    <Alert.Root status="error" borderRadius="0" py={2} px={4}>
      <Alert.Indicator />

      <Alert.Content>
        <Alert.Title>Account blocked</Alert.Title>

        <Alert.Description>
          You can browse the forum, but you cannot create posts or comments
          until an administrator unblocks your account.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}

export default BlockedAccountBanner;