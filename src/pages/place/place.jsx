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
import destinationsApi from '../../api/destinationApi'
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

  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]) // Lưu ID ảnh cần xóa
  const [newImages, setNewImages] = useState([]) // Lưu ảnh mới

  useEffect(() => {
    fetchPlaces()
    fetchDestinations()
  }, [])

  useEffect(() => {}, [placeData])

  const fetchPlaces = async () => {
    try {
      const data = await placeApi.getAll()
      setPlaces(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      const data = await destinationsApi.getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách điểm đến:', error)
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

      await fetchPlaces()
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
        fetchPlaces()
        toast.success('Xóa khách điểm đến thành công!')
      } catch (error) {
        console.error('Lỗi khi xóa điểm đến:', error)
        toast.error('Có lỗi xảy ra khi xóa điểm đến!')
      }
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
        await placeApi.deleteImagePlace(editId, imageId)
      }

      toast.success(`Đã xóa ${selectedImagesToDelete.length} ảnh thành công!`)
      fetchPlaces() // Cập nhật danh sách khách sạn
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
      await placeApi.updateImageplace(editId, newImages)
      toast.success(`Đã thêm ${newImages.length} ảnh thành công!`)

      fetchPlaces() // Cập nhật danh sách khách sạn
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
                    <IconButton onClick={() => handleOpenImageDialog(place.image, place._id)}>
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
        <DialogTitle>Hình ảnh điểm đến</DialogTitle>
        <DialogContent>
          {selectedImages.map((img) => (
            <div key={img._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={selectedImagesToDelete.includes(img._id)}
                onChange={() => handleSelectImageToDelete(img._id)}
              />
              <img src={img.url} alt="place" style={{ width: '100%', marginLeft: 10, borderRadius: 5 }} />
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
export default PlaceManagement
