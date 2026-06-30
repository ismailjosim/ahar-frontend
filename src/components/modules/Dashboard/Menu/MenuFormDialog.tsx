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

import type { MenuItem } from '@/types/menu.interface'
import type { Category } from '@/types/category.interface'
import { Plus, Trash2, X } from 'lucide-react'
import { createMenuItem, updateMenuItem } from '@/services/menu/menusManagement'

const textareaClass =
  'w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-20 resize-y'

const inputClass =
  'w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

interface MenuFormDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  menuItem?: MenuItem
  categories: Category[]
}

interface Variant {
  id?: string
  name: string
  price: number
}

interface AddOn {
  id?: string
  name: string
  price: number
}

const MenuFormDialog = ({
  open,
  onClose,
  onSuccess,
  menuItem,
  categories,
}: MenuFormDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = !!menuItem?.id

  const [state, formAction, isPending] = useActionState(
    isEdit
      ? updateMenuItem.bind(null, menuItem.id)
      : createMenuItem,
    null
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tags, setTags] = useState<string[]>(menuItem?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [variants, setVariants] = useState<Variant[]>(menuItem?.variants || [])
  const [variantName, setVariantName] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [addOns, setAddOns] = useState<AddOn[]>(menuItem?.addOns || [])
  const [addOnName, setAddOnName] = useState('')
  const [addOnPrice, setAddOnPrice] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      if (fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(file)
        fileInputRef.current.files = dt.files
      }
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const addVariant = () => {
    if (variantName.trim() && variantPrice) {
      setVariants([
        ...variants,
        {
          name: variantName.trim(),
          price: parseFloat(variantPrice),
        },
      ])
      setVariantName('')
      setVariantPrice('')
    }
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addAddOn = () => {
    if (addOnName.trim() && addOnPrice) {
      setAddOns([
        ...addOns,
        {
          name: addOnName.trim(),
          price: parseFloat(addOnPrice),
        },
      ])
      setAddOnName('')
      setAddOnPrice('')
    }
  }

  const removeAddOn = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Operation successful')
      formRef.current?.reset()
      setSelectedFile(null)
      setTags([])
      setVariants([])
      setAddOns([])
      onSuccess()
      onClose()
    } else if (state?.message && !state.success) {
      toast.error(state.message)

      if (selectedFile && fileInputRef.current) {
        const dt = new DataTransfer()
        dt.items.add(selectedFile)
        fileInputRef.current.files = dt.files
      }
    }
  }, [state, selectedFile, onSuccess, onClose])

  const handleClose = () => {
    formRef.current?.reset()
    setSelectedFile(null)
    setTags([])
    setTagInput('')
    setVariants([])
    setVariantName('')
    setVariantPrice('')
    setAddOns([])
    setAddOnName('')
    setAddOnPrice('')
    onClose()
  }

  const fd = state?.formData

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] flex flex-col p-0 sm:max-w-4xl'>
        <DialogHeader className='px-6 pt-6 pb-4'>
          <DialogTitle>
            {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className='flex flex-col flex-1 min-h-0'
        >
          <div className='flex-1 overflow-y-auto px-6 space-y-6 pb-4'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>
                Basic Information
              </h3>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Field>
                  <FieldLabel htmlFor='name'>Menu Item Name *</FieldLabel>
                  <Input
                    id='name'
                    name='name'
                    placeholder='e.g. Chicken Biryani'
                    defaultValue={fd?.name || menuItem?.name || ''}
                    required
                  />
                  <InputFieldError field='name' state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor='categoryId'>Category *</FieldLabel>
                  <select
                    id='categoryId'
                    name='categoryId'
                    defaultValue={
                      fd?.categoryId || menuItem?.categoryId || ''
                    }
                    className={inputClass}
                    required
                  >
                    <option value=''>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <InputFieldError field='categoryId' state={state} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor='description'>Description</FieldLabel>
                <textarea
                  id='description'
                  name='description'
                  placeholder='Short description of this menu item'
                  defaultValue={fd?.description || menuItem?.description || ''}
                  className={textareaClass}
                />
                <InputFieldError field='description' state={state} />
              </Field>
            </div>

            {/* Pricing & Availability */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>
                Pricing & Availability
              </h3>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <Field>
                  <FieldLabel htmlFor='price'>Price (BDT) *</FieldLabel>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    step='0.01'
                    min='0'
                    placeholder='299'
                    defaultValue={fd?.price || menuItem?.price || ''}
                    required
                  />
                  <InputFieldError field='price' state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor='prepTime'>Prep Time</FieldLabel>
                  <Input
                    id='prepTime'
                    name='prepTime'
                    placeholder='e.g. 30 mins'
                    defaultValue={fd?.prepTime || menuItem?.prepTime || ''}
                  />
                  <InputFieldError field='prepTime' state={state} />
                </Field>

                <Field>
                  <FieldLabel htmlFor='rating'>Rating (0-5)</FieldLabel>
                  <Input
                    id='rating'
                    name='rating'
                    type='number'
                    step='0.1'
                    min='0'
                    max='5'
                    placeholder='4.5'
                    defaultValue={fd?.rating || menuItem?.rating || ''}
                  />
                  <InputFieldError field='rating' state={state} />
                </Field>
              </div>

              <div className='flex gap-6'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isAvailable'
                    value='true'
                    defaultChecked={
                      menuItem?.isAvailable ?? true
                    }
                    className='w-4 h-4 cursor-pointer accent-primary'
                  />
                  <span className='text-sm font-medium'>Available</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isFeatured'
                    value='true'
                    defaultChecked={menuItem?.isFeatured || false}
                    className='w-4 h-4 cursor-pointer accent-primary'
                  />
                  <span className='text-sm font-medium'>Featured</span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isSpicy'
                    value='true'
                    defaultChecked={menuItem?.isSpicy || false}
                    className='w-4 h-4 cursor-pointer accent-primary'
                  />
                  <span className='text-sm font-medium'>Spicy</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>Tags</h3>

              <div className='flex gap-2'>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder='Add a tag (e.g. vegetarian)'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={addTag}
                  className='rounded-md'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className='flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => removeTag(tag)}
                      className='hover:text-primary/70'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ))}
              </div>

              <input
                type='hidden'
                name='tags'
                value={JSON.stringify(tags)}
              />
            </div>

            {/* Variants */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>
                Variants
              </h3>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <Input
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  placeholder='Variant name (e.g. Small, Large)'
                />
                <Input
                  value={variantPrice}
                  onChange={(e) => setVariantPrice(e.target.value)}
                  type='number'
                  step='0.01'
                  min='0'
                  placeholder='Price'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={addVariant}
                  className='rounded-md'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              <div className='space-y-2'>
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between bg-muted/50 p-3 rounded-md'
                  >
                    <div>
                      <p className='font-medium text-sm'>{variant.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        +৳{variant.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeVariant(index)}
                      className='text-destructive hover:text-destructive/70'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </div>

              <input
                type='hidden'
                name='variants'
                value={JSON.stringify(variants)}
              />
            </div>

            {/* Add-ons */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>
                Add-ons
              </h3>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                <Input
                  value={addOnName}
                  onChange={(e) => setAddOnName(e.target.value)}
                  placeholder='Add-on name (e.g. Extra sauce)'
                />
                <Input
                  value={addOnPrice}
                  onChange={(e) => setAddOnPrice(e.target.value)}
                  type='number'
                  step='0.01'
                  min='0'
                  placeholder='Price'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={addAddOn}
                  className='rounded-md'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              <div className='space-y-2'>
                {addOns.map((addOn, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between bg-muted/50 p-3 rounded-md'
                  >
                    <div>
                      <p className='font-medium text-sm'>{addOn.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        +৳{addOn.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => removeAddOn(index)}
                      className='text-destructive hover:text-destructive/70'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </div>

              <input
                type='hidden'
                name='addOns'
                value={JSON.stringify(addOns)}
              />
            </div>

            {/* Image Upload */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-sm text-foreground'>
                Menu Item Image
              </h3>

              <Field>
                <FieldLabel htmlFor='file'>
                  Upload Image
                  {isEdit && (
                    <span className='ml-1 font-normal text-muted-foreground'>
                      (upload to replace)
                    </span>
                  )}
                </FieldLabel>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer min-h-48 ${
                    isDragging
                      ? 'border-primary bg-primary/5 scale-[0.99]'
                      : 'border-border bg-muted/20 hover:bg-muted/40 hover:border-muted-foreground/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id='file'
                    name='file'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                  />

                  {selectedFile || menuItem?.imageUrl ? (
                    <div className='flex flex-col items-center gap-3 w-full pointer-events-none'>
                      <div className='relative w-28 h-28 rounded-lg overflow-hidden border border-border shadow-sm bg-background'>
                        <Image
                          src={
                            selectedFile
                              ? URL.createObjectURL(selectedFile)
                              : menuItem!.imageUrl!
                          }
                          alt='Preview'
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium text-foreground max-w-xs truncate'>
                          {selectedFile ? selectedFile.name : 'Current Image'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Drag and drop or click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center justify-center gap-3 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-10 h-10 stroke-muted-foreground/70 group-hover:stroke-primary transition-colors'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
                        />
                      </svg>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>
                          Drag & drop your image here, or{' '}
                          <span className='text-primary underline underline-offset-2'>
                            browse
                          </span>
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Supports JPG, PNG or WebP
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <InputFieldError field='file' state={state} />
              </Field>
            </div>
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

            <Button type='submit' disabled={isPending}>
              {isPending
                ? 'Saving...'
                : isEdit
                  ? 'Update Item'
                  : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MenuFormDialog