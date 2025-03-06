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
import { getAllDestinations } from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

const PlaceManagement = () => {
  const [places, setPlaces] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [placeData, setPlaceData] = useState({
    name: '',
    description: '',
    image: [],
    destination_id: null
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  useEffect(() => {
    fetchPlace()
    fetchDestinations()
  }, [])

  useEffect(() => {}, [placeData])

  const fetchPlace = async () => {
    try {
      const data = await placeApi.getAll()
      setPlaces(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      const data = await getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const handleOpen = (place = null) => {
    if (place) {
      setPlaceData({ ...place, destination_id: place.destination_id || null })
      setPreviewImages(place.image ? place.image.map((img) => img.url) : [])
      setEditId(place._id)
    } else {
      setPlaceData({ name: '', description: '', image: [], destination_id: null })
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
    setPlaceData({ ...placeData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setPlaceData({ ...placeData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      const jsonData = {
        name: placeData.name,
        description: placeData.description,
        destination_id: placeData.destination_id ? placeData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (placeData.image.length > 0) {
        placeData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await placeApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await placeApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo địa điểm thành công!')
      }

      setCheck(false)

      setPlaceData({ name: '', address: '', price: '', rating: '', image: [], destination_id: null })

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
        await placeApi.deletePlace(id)
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
      <h2>Danh Sách Địa Điểm </h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm địa điểm
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
            {places.map((place) => (
              <TableRow key={place._id}>
                <TableCell>{place.name}</TableCell>
                <TableCell>{place.description}</TableCell>
                <TableCell>
                  {place.image && place.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(place.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(place)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(place._id)}>
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
        <DialogTitle>{editId ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" name="name" value={placeData.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField
            label="Miêu tả"
            name="description"
            value={placeData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          {!editId && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          )}
          <Autocomplete
            options={destinations}
            getOptionLabel={(option) => option?.name}
            defaultValue={placeData?.destination_id?._id || null}
            value={placeData?.destination_id || null}
            onChange={(event, newValue) => setPlaceData({ ...placeData, destination_id: newValue })}
            renderInput={(params, index) => (
              <TextField key={index} {...params} label="Chọn địa điểm" margin="dense" fullWidth />
            )}
          />
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
        <DialogTitle>Hình ảnh địa điểm</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="place" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
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
export default PlaceManagement
