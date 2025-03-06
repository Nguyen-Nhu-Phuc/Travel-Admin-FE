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
  IconButton
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye } from '@tabler/icons-react'
import placeApi from '../../api/placeApi'
import destinationApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

const DestinationManagement = () => {
  // const [places, setPlaces] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [destination, setDestination] = useState([])
  const [destinationData, setDestinationData] = useState({
    name: '',
    description: '',
    image: []
    // destination_id: null
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  useEffect(() => {
    // fetchPlace()
    fetchDestinations()
  }, [])

  // useEffect(() => {}, [placeDestination])

  const fetchDestinations = async () => {
    try {
      const data = await destinationApi.getAll()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách điểm đến:', error)
    }
  }

  // const fetchDestinations = async () => {
  //   try {
  //     const data = await getAllDestinations()
  //     setDestinations(data)
  //   } catch (error) {
  //     console.error('Lỗi khi lấy danh sách địa điểm:', error)
  //   }
  // }

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
    setdestinationData({ ...destinationData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      const jsonData = {
        name: destinationData.name,
        description: destinationData.description
        // destination_id: destinationData.destination_id ? destinationData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (destinationData.image.length > 0) {
        destinationData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await destinationApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await destinationApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo địa điểm thành công!')
      }

      setCheck(false)

      setDestinationData({ name: '', address: '', image: [] })

      await fetchPlace()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu địa điểm:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await destinationApi.delete(id)
        fetchPlace()
      } catch (error) {
        console.error('Lỗi khi xóa khách sạn:', error)
      }
    }
  }

  const handleOpenImageDialog = (images) => {
    setSelectedImages(images)
    setImageDialogOpen(true)
  }

  return (
    <div>
      <h2>Danh Sách Điểm Đến </h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm điểm đến
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Miêu tả</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinations.map((destination) => (
              <TableRow>
                <TableCell>{destination.name}</TableCell>
                <TableCell>{destination.description}</TableCell>
                <TableCell>
                  {destination.image && destination.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(destination.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(destination)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(destination._id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
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
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="destination" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </div>
  )
}
export default DestinationManagement
