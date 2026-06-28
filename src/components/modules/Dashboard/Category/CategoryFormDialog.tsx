'use client'

import InputFieldError from '@/components/shared/InputFieldError'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import Image from 'next/image'
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'



import {
  createCategory,
  updateCategory,
} from '@/services/category/categoriesManagement'
import { Category } from '@/types/category.interface'

const selectClass =
  'w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const textareaClass =
  'w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24 resize-y'

interface ICategoryFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  category?: Category
}

const CategoryFormDialog = ({
  open,
  onClose,
  onSuccess,
  category,
}: ICategoryFormDialogProps) => {
  const formRef =
    useRef<HTMLFormElement>(null)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const isEdit = !!category?.id

  const [state, formAction, isPending] =
    useActionState(
      isEdit
        ? updateCategory.bind(null, category.id)
        : createCategory,
      null
    )

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(
        state.message || 'Operation successful'
      )

      formRef.current?.reset()

      setSelectedFile(null)

      onSuccess()
      onClose()
    } else if (
      state?.message &&
      !state.success
    ) {
      toast.error(state.message)

      if (
        selectedFile &&
        fileInputRef.current
      ) {
        const dt = new DataTransfer()

        dt.items.add(selectedFile)

        fileInputRef.current.files =
          dt.files
      }
    }
  }, [
    state,
    selectedFile,
    onSuccess,
    onClose,
  ])

  const handleClose = () => {
    formRef.current?.reset()
    setSelectedFile(null)
    onClose()
  }

  const fd = state?.formData

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className='max-h-[90vh] flex flex-col p-0 sm:max-w-2xl'>
        <DialogHeader className='px-6 pt-6 pb-4'>
          <DialogTitle>
            {isEdit
              ? 'Edit Category'
              : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className='flex flex-col flex-1 min-h-0'
        >
          <div className='flex-1 overflow-y-auto px-6 space-y-4 pb-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Field>
                <FieldLabel htmlFor='name'>
                  Category Name
                </FieldLabel>

                <Input
                  id='name'
                  name='name'
                  placeholder='e.g. Biryani'
                  defaultValue={
                    fd?.name ||
                    category?.name ||
                    ''
                  }
                />

                <InputFieldError
                  field='name'
                  state={state}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='slug'>
                  Slug
                </FieldLabel>

                <Input
                  id='slug'
                  name='slug'
                  placeholder='auto-generated if empty'
                  defaultValue={
                    fd?.slug ||
                    category?.slug ||
                    ''
                  }
                />

                <p className='text-xs text-muted-foreground mt-1'>
                  Leave blank to auto-generate
                </p>

                <InputFieldError
                  field='slug'
                  state={state}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor='description'>
                Description
              </FieldLabel>

              <textarea
                id='description'
                name='description'
                placeholder='Short description of this category'
                defaultValue={
                  fd?.description ||
                  category?.description ||
                  ''
                }
                className={textareaClass}
              />

              <InputFieldError
                field='description'
                state={state}
              />
            </Field>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Field>
                <FieldLabel htmlFor='icon'>
                  Icon
                </FieldLabel>

                <Input
                  id='icon'
                  name='icon'
                  placeholder='🍛 or icon name'
                  defaultValue={
                    fd?.icon ||
                    category?.icon ||
                    ''
                  }
                />

                <InputFieldError
                  field='icon'
                  state={state}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='status'>
                  Status
                </FieldLabel>

                <select
                  id='status'
                  name='status'
                  className={selectClass}
                  defaultValue={
                    fd?.status ||
                    category?.status ||
                    'ACTIVE'
                  }
                >
                  <option value='ACTIVE'>
                    Active
                  </option>

                  <option value='INACTIVE'>
                    Inactive
                  </option>

                  <option value='ARCHIVED'>
                    Archived
                  </option>
                </select>

                <InputFieldError
                  field='status'
                  state={state}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor='file'>
                Category Image
                {isEdit && (
                  <span className='ml-1 font-normal text-muted-foreground'>
                    (upload to replace)
                  </span>
                )}
              </FieldLabel>

              {(selectedFile ||
                category?.image) && (
                  <div className='mb-2 flex items-center gap-3'>
                    <Image
                      src={
                        selectedFile
                          ? URL.createObjectURL(
                            selectedFile
                          )
                          : category!.image!
                      }
                      alt='Preview'
                      width={72}
                      height={72}
                      className='rounded-lg border border-border object-cover'
                    />

                    <p className='text-xs text-muted-foreground'>
                      {selectedFile
                        ? selectedFile.name
                        : 'Current image'}
                    </p>
                  </div>
                )}

              <Input
                ref={fileInputRef}
                id='file'
                name='file'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />

              <p className='text-xs text-muted-foreground mt-1'>
                JPG, PNG or WebP.
              </p>

              <InputFieldError
                field='file'
                state={state}
              />
            </Field>
          </div>

          <div className='flex justify-end gap-2 px-6 py-4 border-t bg-muted/50'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={isPending}
            >
              {isPending
                ? 'Saving...'
                : isEdit
                  ? 'Update Category'
                  : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormDialog