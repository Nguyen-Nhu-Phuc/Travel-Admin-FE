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
import { IconEye } from '@tabler/icons-react'
import hotelApi from '../../api/hotelApi'

const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [open, setOpen] = useState(false)
  const [hotelData, setHotelData] = useState({ name: '', address: '', price: '', rating: '', image: [] })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const data = await hotelApi.getAll()
      setHotels(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error)
    }
  }

  const handleOpen = (hotel = null) => {
    if (hotel) {
      setHotelData(hotel)
      setPreviewImages(hotel.image ? hotel.image.map((img) => img.url) : [])
      setEditId(hotel.id)
    } else {
      setHotelData({ name: '', address: '', price: '', rating: '', image: [] })
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
    const imageURLs = files.map((file) => URL.createObjectURL(file)) // Tạo URL ảnh xem trước
    setPreviewImages(imageURLs)
    setHotelData({ ...hotelData, image: files }) // Lưu file vào state
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('name', hotelData.name)
      formData.append('address', hotelData.address)
      formData.append('price', hotelData.price)
      formData.append('rating', hotelData.rating)

      if (hotelData?.image?.length > 0) {
        hotelData?.image?.forEach((file, index) => {
          formData.append(`image[${index}]`, file)
        })
      }

      if (editId) {
        await hotelApi.update(editId, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        await hotelApi.create(formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      await fetchHotels()
      handleClose()
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu khách sạn:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await hotelApi.deleteHotel(id)
        fetchHotels()
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
      <h2>Danh Sách khách sạn</h2>
      <div style={{ marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Thêm khách sạn
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.price)}
                </TableCell>
                <TableCell>{hotel.rating}</TableCell>
                <TableCell>
                  {hotel.image && hotel.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(hotel.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(hotel)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(hotel._id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
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
          <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          <div style={{ display: 'flex', marginTop: '10px' }}>
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="preview"
                style={{ width: 70, height: 70, marginRight: 5, borderRadius: 5 }}
              />
            ))}
          </div>
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

      {/* Dialog hiển thị ảnh */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh khách sạn</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="hotel" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default HotelManagement
