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
import hotelApi from '../../api/hotelApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'
import { DeleteElements } from '../common/deleteElements.jsx'

import MapApp from '../common/map.jsx'



const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    price: '',
    rating: '',
    image: [],
    destination_id: '',
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]) // Lưu ID ảnh cần xóa
  const [newImages, setNewImages] = useState([]) // Lưu ảnh mới
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  const [checkElement, setCheckElement] = useState('')


  const [long, setLong] = useState('')
  const [lat, setLat] = useState('')

  useEffect(() => {
    fetchHotels()
    fetchDestinations()
  }, [])

  useEffect(() => { }, [hotelData])

  const fetchHotels = async () => {
    try {
      const data = await hotelApi.getAll()
      setHotels(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      const data = await destinationsApi.getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const handleOpen = (hotel = null) => {
    if (hotel) {
      setHotelData({ ...hotel, destination_id: hotel.destination_id || '' })
      setPreviewImages(hotel.image ? hotel.image.map((img) => img.url) : [])
      setEditId(hotel._id)
    } else {
      setHotelData({ name: '', address: '', price: '', rating: '', image: [], destination_id: '', long: '', lat: '' })
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
    setHotelData({ ...hotelData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setHotelData({ ...hotelData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      if (!hotelData.name) {
        toast.warn('Vui lòng điền tên khách sạn!')
        setCheck(false)
        return
      }

      const jsonData = {
        name: hotelData.name,
        address: hotelData.address,
        long: +long,
        price: +hotelData.price,
        lat: +lat,
        rating: +hotelData.rating,
        destination_id: hotelData.destination_id ? hotelData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (hotelData.image.length > 0) {
        hotelData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await hotelApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await hotelApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo khách sạn thành công!')
      }

      setCheck(false)

      setHotelData({ name: '', address: '', price: '', rating: '', image: [], destination_id: null })

      await fetchHotels()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu khách sạn:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await hotelApi.deleteHotel(id)
      fetchHotels()
      toast.success('Xóa khách sạn thành công!')
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn:', error)
      toast.error('Có lỗi xảy ra khi xóa khách sạn!')
    }
  }


  const handleOpenImageDialog = (images, id) => {
    setEditId(id)
    setSelectedImages(images)
    setImageDialogOpen(true)
  }
  // ======================================
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
        await hotelApi.deleteImageHotel(editId, imageId)
      }

      toast.success(`Đã xóa ${selectedImagesToDelete.length} ảnh thành công!`)
      fetchHotels() // Cập nhật danh sách khách sạn
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
      await hotelApi.updateImageHotel(editId, newImages)
      toast.success(`Đã thêm ${newImages.length} ảnh thành công!`)

      fetchHotels() // Cập nhật danh sách khách sạn
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

  const handleOpenDelete = (id, data) => {
    setId(id)
    setData(data)
    setCheckElement('hotel')
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  return (
    <div>
      <h2>Danh Sách Khách Sạn</h2>
      <Button startIcon={<IconPlus ></IconPlus >} sx={{ marginBottom: '20px' }} variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm khách sạn
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Thuộc địa điểm</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Giá</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Đánh giá</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hình ảnh</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Vị trí</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.length > 0 ? hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell width={'25%'}>{hotel.name}</TableCell>
                <TableCell width={'20%'}>{hotel.address}</TableCell>
                <TableCell>{hotel.destination_id.name}</TableCell>
                <TableCell >
                  {hotel.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price) : 'Chưa cập nhật'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{hotel.rating}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {(
                    <IconButton onClick={() => handleOpenImageDialog(hotel.image, hotel._id)}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {hotel.long && hotel.lat && (
                    <Typography>
                      Kinh độ: {hotel.long}
                      <br />
                      Vĩ độ: {hotel.lat}</Typography>)}
                </TableCell>

                <TableCell sx={{ textAlign: 'center' }}>
                  <Button color="primary" onClick={() => handleOpen(hotel)}>
                    <IconEdit stroke={2}></IconEdit>
                  </Button>
                  <Button color="error" onClick={() => handleOpenDelete(hotel?._id, hotel)}>
                    <IconTrash stroke={2}></IconTrash>
                  </Button>
                </TableCell>
              </TableRow>
            )) :
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center' }}>Không có dữ liệu</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      {openDelete && <DeleteElements checkElement={checkElement} id={id} data={data} open={openDelete} handleClose={handleCloseDelete} onDelete={handleDelete} />}

      <Dialog open={open} fullWidth onClose={handleClose}>
        <div>
          <Backdrop
            sx={(theme) => ({ color: '#199c51', zIndex: 999999 })}
            open={check}

          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <DialogTitle>{editId ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn'}</DialogTitle>
        <DialogContent>
          <TextField label="Tên" name="name" value={hotelData.name} onChange={handleChange} fullWidth margin="dense" />
          <TextField
            label="Địa chỉ"
            name="address"
            value={hotelData.address}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Autocomplete
            options={destinations}
            getOptionLabel={(option) => option?.name}
            defaultValue={hotelData?.destination_id?._id || null}
            value={hotelData?.destination_id || null}
            onChange={(event, newValue) => setHotelData({ ...hotelData, destination_id: newValue })}
            renderInput={(params, index) => (
              <TextField key={index} {...params} label="Chọn địa điểm" margin="dense" fullWidth />
            )}
          />
          <TextField
            label="Giá"
            name="price"
            value={hotelData.price}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Đánh giá"
            name="rating"
            value={hotelData.rating}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Typography>Chọn vị trí khách sạn</Typography>
          <MapApp locationLong={hotelData?.long} locationLat={hotelData?.lat} setLocationLong={setLong} setLocationLat={setLat}></MapApp>

          {!editId && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          )}

        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button variant='contained' onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh khách sạn</DialogTitle>
        <DialogContent>
          {selectedImages.map((img) => (
            <div key={img._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={selectedImagesToDelete.includes(img._id)}
                onChange={() => handleSelectImageToDelete(img._id)}
              />
              <img src={img.url} alt="hotel" style={{ width: '100%', marginLeft: 10, borderRadius: 5 }} />
            </div>
          ))}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
          <div>
            <Button variant='contained' onClick={handleDeleteSelectedImages} color="secondary">
              Xóa ảnh đã chọn
            </Button>
            <Button variant='contained' onClick={handleUploadNewImages} color="primary">
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
export default HotelManagement
