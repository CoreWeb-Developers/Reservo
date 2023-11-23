import { Button, ButtonGroup, Flex, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import FileUpload from '~/components/FileUpload/FileUpload';
import { AVATAR_PATH } from '~/consts/avatar';
import useFileSubmit from '~/hooks/use-file-submit';
import useRequestHandler from '~/hooks/use-request-handler';
import useCustomToast from '~/hooks/use-custom-toast';
import { useUpdateServicePosterMutation, useDeleteServicePosterMutation } from '~/store/api/service-slice';
import { FormValues, validate } from '~/validation/avatar';
import type { Service } from '~/types/service';

type IProps = {
  service: Service;
};

const ServiceFormPoster = ({ service }: IProps) => {
  const { toast } = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [updatePoster, { isLoading: isUpdateLoading }] = useUpdateServicePosterMutation();
  const [deletePoster, { isLoading: isDeleteLoading }] = useDeleteServicePosterMutation();

  const updateHandler = async (data: FormData) => {
    try {
      await updatePoster({ form: data, id: service.id }).unwrap();
      toast("You've successfully updated services's poster.", 'success');
      reset();
    } catch (error: any) {
      toast(error.data.message, 'error');
    }
  };

  const { handler: deleteHandler } = useRequestHandler<number>({
    f: deletePoster,
    successMsg: "You've successfully removed services's poster.",
  });

  const { onSubmit } = useFileSubmit({ handleSubmit, requestHandler: updateHandler, reset, fieldName: 'poster' });

  return (
    <form onSubmit={onSubmit}>
      <Flex flexDir="column">
        <FormControl isInvalid={!!errors.files} isRequired>
          <FileUpload
            register={register('files', { validate })}
            avatar={AVATAR_PATH(service.picturePath)}
            name={service.name as string}
            isPoster={true}
          />

          <FormErrorMessage>{errors.files && errors?.files.message}</FormErrorMessage>
        </FormControl>

        <ButtonGroup mt="4" variant="outline" isAttached>
          <Button colorScheme="blue" type="submit" isLoading={isUpdateLoading}>
            Save
          </Button>
          <Button
            isDisabled={!service.picturePath}
            colorScheme="red"
            isLoading={isDeleteLoading}
            onClick={async () => {
              await deleteHandler(service.id);
            }}
          >
            Remove
          </Button>
        </ButtonGroup>
      </Flex>
    </form>
  );
};

export default ServiceFormPoster;
