import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react'
import placeApi from '../../api/placeApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

import { DeleteElements } from '../common/deleteElements.jsx'

import MapApp from '../common/map.jsx'

const DestinationManagement = () => {
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [destination, setDestination] = useState([])
  const [destinationData, setDestinationData] = useState({
    name: '',
    description: '',
    image: []
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  const [checkElement, setCheckElement] = useState('')


  const [long, setLong] = useState('')
  const [lat, setLat] = useState('')


  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]) // Lưu ID ảnh cần xóa
  const [newImages, setNewImages] = useState([]) // Lưu ảnh mới

  useEffect(() => {
    fetchDestinations()
  }, [])

  useEffect(() => { }, [destinationData])

  const fetchDestinations = async () => {
    try {
      const data = await destinationsApi.getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách điểm đến:', error)
    }
  }

  const handleOpen = (destination = null) => {
    if (destination) {
      setDestinationData({ ...destination })
      setPreviewImages(destination.image ? destination.image.map((img) => img.url) : [])
      setEditId(destination._id)
    } else {
      setDestinationData({ name: '', description: '', image: [] })
      setPreviewImages([])
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setPreviewImages([])
    setEditId(null)
  }

  const handleChange = (e) => {
    setDestinationData({ ...destinationData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setDestinationData({ ...destinationData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      if (!destinationData.name) {
        toast.warn('Vui lòng điền tên điểm đến!')
        setCheck(false)
        return
      }

      const jsonData = {
        name: destinationData.name,
        long: +long,
        lat: +lat,
        description: destinationData.description
      }

      formData.append('data', JSON.stringify(jsonData))

      if (destinationData.image.length > 0) {
        destinationData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await destinationsApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await destinationsApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo địa điểm thành công!')
      }

      setCheck(false)

      setDestinationData({ name: '', address: '', image: [] })

      await fetchDestinations()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu địa điểm:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await destinationsApi.delete(id)
      fetchDestinations()
      toast.success('Xóa điểm đến thành công!')
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn:', error)
      toast.error('Có lỗi xảy ra!')
    }
  }

  const handleOpenImageDialog = (images, id) => {
    setEditId(id)
    setSelectedImages(images)
    setImageDialogOpen(true)
  }

  // ===========================

  const handleFileUpload = (e) => {
    setNewImages(Array.from(e.target.files))
  }

  const handleDeleteSelectedImages = async () => {
    if (!selectedImagesToDelete.length || !editId) {
      toast.warn('Vui lòng chọn ít nhất một ảnh để xóa!')
      return
    }

    try {
      for (const imageId of selectedImagesToDelete) {
        await destinationsApi.deleteImageDestination(editId, imageId)
      }

      toast.success(`Đã xóa ${selectedImagesToDelete.length} ảnh thành công!`)
      fetchDestinations()
      setSelectedImagesToDelete([])
      setImageDialogOpen(false)
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error)
      toast.error('Có lỗi xảy ra khi xóa ảnh!')
    }
  }

  const handleUploadNewImages = async () => {
    console.log('newImages:', newImages)

    if (newImages.length == 0) {
      toast.warn('Vui lòng chọn ảnh để tải lên!')
      return
    }

    try {
      await destinationsApi.updateImageDestination(editId, newImages)
      toast.success(`Đã thêm ${newImages.length} ảnh thành công!`)

      fetchDestinations()
      setNewImages([])
      setImageDialogOpen(false)
    } catch (error) {
      console.error('Lỗi khi thêm ảnh:', error)
      toast.error('Có lỗi xảy ra khi thêm ảnh!')
    }
  }

  const handleSelectImageToDelete = (imageId) => {
    setSelectedImagesToDelete((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    )
  }
  // ===========================

  const handleOpenDelete = (id, data) => {
    setId(id)
    setData(data)
    setCheckElement('destination')
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  return (
    <div>
      <h2>Danh Sách Điểm Đến </h2>
      <Button startIcon={<IconPlus ></IconPlus >} sx={{ marginBottom: '20px' }} variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm điểm đến
      </Button>
      {openDelete && <DeleteElements checkElement={checkElement} id={id} data={data} open={openDelete} handleClose={handleCloseDelete} onDelete={handleDelete} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Miêu tả</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hình ảnh</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Vị trí</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hành động</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {destinations?.map((destination, index) => (
              <TableRow key={index}>
                <TableCell>{destination.name}</TableCell>
                <TableCell>{destination.description}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {destination?.image && destination?.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(destination.image, destination._id)}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {destination.long && destination.lat && (
                    <Typography>
                      Kinh độ: {destination.long}
                      <br />
                      Vĩ độ: {destination.lat}</Typography>)}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button color="primary" onClick={() => handleOpen(destination)}>
                    <IconEdit stroke={2}></IconEdit>
                  </Button>
                  <Button color="error" onClick={() => handleOpenDelete(destination._id, destination)}>
                    <IconTrash stroke={2}></IconTrash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog fullWidth open={open} onClose={handleClose}>
        <div>
          <Backdrop sx={(theme) => ({ color: '#199c51', zIndex: 999999 })} open={check}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <DialogTitle>{editId ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            name="name"
            value={destinationData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Miêu tả"
            name="description"
            value={destinationData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          {!editId && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          )}
          <Typography>Chọn vị trí điểm đến</Typography>
          <MapApp locationLong={destinationData?.long} locationLat={destinationData?.lat} setLocationLong={setLong} setLocationLat={setLat}></MapApp>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh điểm đến</DialogTitle>
        <DialogContent>
          {selectedImages?.map((img) => (
            <div key={img._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={selectedImagesToDelete.includes(img._id)}
                onChange={() => handleSelectImageToDelete(img._id)}
              />
              <img src={img.url} alt="destination" style={{ width: '100%', marginLeft: 10, borderRadius: 5 }} />
            </div>
          ))}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
          <div>
            <Button onClick={handleDeleteSelectedImages} color="secondary">
              Xóa ảnh đã chọn
            </Button>
            <Button onClick={handleUploadNewImages} color="primary">
              Thêm ảnh
            </Button>
            <Button onClick={() => setImageDialogOpen(false)} color="primary">
              Đóng
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </div>
  )
}
export default DestinationManagement
