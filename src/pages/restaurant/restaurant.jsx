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
  Typography,
  IconButton
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react'
import restaurantApi from '../../api/restaurantApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'
import { DeleteElements } from '../common/deleteElements.jsx'

import MapApp from '../common/map.jsx'

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [restaurantData, setRestaurantData] = useState({
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
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [checkElement, setCheckElement] = useState(null)

  const [long, setLong] = useState('')
  const [lat, setLat] = useState('')

  useEffect(() => {
    fetchRestaurant()
    fetchDestinations()
  }, [])

  useEffect(() => { }, [restaurantData])

  const fetchRestaurant = async () => {
    try {
      const data = await restaurantApi.getAll()
      setRestaurants(data)
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

  const handleOpen = (restaurant = null) => {
    if (restaurant) {
      console.log(restaurant)

      setRestaurantData({ ...restaurant, destination_id: restaurant.destination_id || null })
      setPreviewImages(restaurant.image ? restaurant.image.map((img) => img.url) : [])
      setEditId(restaurant._id)
    } else {
      setRestaurantData({ name: '', description: '', image: [], destination_id: null })
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
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setRestaurantData({ ...restaurantData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      if (!restaurantData.name) {
        toast.warn('Vui lòng điền tên nhà hàng!')
        setCheck(false)
        return
      }

      const jsonData = {
        name: restaurantData.name,
        description: restaurantData.description,
        long: +long,
        lat: +lat,
        destination_id: restaurantData.destination_id ? restaurantData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (restaurantData.image.length > 0) {
        restaurantData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await restaurantApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await restaurantApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo nhà hàng thành công!')
      }

      setCheck(false)

      setRestaurantData({ name: '', description: '', image: [], destination_id: null })

      await fetchRestaurant()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu nhà hàng:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await restaurantApi.deleteRestaurant(id)
      fetchRestaurant()
    } catch (error) {
      console.error('Lỗi khi xóa nhà hàng:', error)
    }
  }

  const handleOpenImageDialog = (images) => {
    setSelectedImages(images)
    setImageDialogOpen(true)
  }



  const handleOpenDelete = (id, data) => {
    setCheckElement('restaurant')
    setId(id)
    setData(data)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  return (
    <div>
      <h2>Danh Sách Nhà Hàng </h2>
      <Button startIcon={<IconPlus ></IconPlus >} sx={{ marginBottom: '20px' }} variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm nhà hàng
      </Button>
      {openDelete && <DeleteElements checkElement={checkElement} id={id} data={data} open={openDelete} handleClose={handleCloseDelete} onDelete={handleDelete} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Miêu tả</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hình ảnh</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Vị trí</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant._id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>{restaurant.description}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {restaurant.image && restaurant.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(restaurant.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {restaurant.long && restaurant.lat && (<Typography>Kinh độ: {restaurant.long}
                    <br />
                    Vĩ độ: {restaurant.lat}</Typography>)}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button color="primary" onClick={() => handleOpen(restaurant)}>
                    <IconEdit stroke={2}></IconEdit>
                  </Button>
                  <Button color="error" onClick={() => handleOpenDelete(restaurant._id, restaurant)}>
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
        <DialogTitle>{editId ? 'Chỉnh sửa nhà hàng' : 'Thêm nhà hàng'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            name="name"
            value={restaurantData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Autocomplete
            options={destinations}
            getOptionLabel={(option) => option?.name}
            defaultValue={restaurantData?.destination_id?._id || null}
            value={restaurantData?.destination_id || null}
            onChange={(event, newValue) => setRestaurantData({ ...restaurantData, destination_id: newValue })}
            renderInput={(params, index) => (
              <TextField key={index} {...params} label="Chọn địa điểm" margin="dense" fullWidth />
            )}
          />
          <TextField
            label="Miêu tả"
            name="description"
            value={restaurantData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <Typography>Chọn vị trí khách sạn</Typography>
          <MapApp locationLong={restaurantData?.long} locationLat={restaurantData?.lat} setLocationLong={setLong} setLocationLat={setLat}></MapApp>
          {!editId && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='contained' color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant='contained' color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh nhà hàng</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="restaurant" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
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
export default RestaurantManagement
