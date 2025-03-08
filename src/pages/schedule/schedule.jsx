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
  Box
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye } from '@tabler/icons-react'
import scheduleApi from '../../api/scheduleApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import useMediaQuery from '@mui/material/useMediaQuery'

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root:nth-of-type(even) .MuiTimelineContent-root': {
    textAlign: 'left'
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none'
      }
    }
  }
}))

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  const theme = useTheme()
  const isBelowMdScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const [scheduleOne, setScheduleOne] = useState(null)

  useEffect(() => {
    fetchSchedule()
    fetchDestinations()
  }, [])

  useEffect(() => {}, [scheduleData])

  const fetchSchedule = async () => {
    try {
      const data = await scheduleApi.getAll()
      setSchedules(data)
      console.log(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const fetchOneSchedule = async (id) => {
    try {
      const data = await scheduleApi.getById(id)
      setScheduleOne(data)
    } catch (error) {
      console.error('Lỗi:', error)
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

  const handleClose = () => {
    setOpen(false)
    setPreviewImages([])
    setEditId(null)
  }

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setScheduleData({ ...scheduleData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      const jsonData = {
        name: scheduleData.name,
        description: scheduleData.description,
        destination_id: scheduleData.destination_id ? scheduleData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (scheduleData.image.length > 0) {
        scheduleData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await scheduleApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await scheduleApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo địa điểm thành công!')
      }

      setCheck(false)

      setScheduleData({ name: '', address: '', start_date: '', end_date: '', image: [], destination_id: null })

      await fetchSchedule()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu địa điểm:', error)
    }
  }

  const handleOpenDetailDialog = (schedule, id) => {
    setSelectedSchedule(schedule)
    setDetailDialogOpen(true)
    fetchOneSchedule(id)
  }
  // Hàm chuyển đổi time từ định dạng AM/PM sang số (giờ phút)
  const convertTo24Hour = (time) => {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1)
    let hours = parseInt(hour, 10)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + parseInt(minute, 10) // Tổng số phút trong ngày
  }

  let events = []
  scheduleOne?.schedule?.forEach((day) => {
    if (day.hotel) {
      events.push({ ...day.hotel, type: 'hotel' })
    }
    if (day.place) {
      events.push(...day.place.map((p) => ({ ...p, type: 'place' })))
    }
    if (day.restaurant) {
      events.push(...day.restaurant.map((r) => ({ ...r, type: 'restaurant' })))
    }
  })

  // Sắp xếp theo thời gian tăng dần
  events.sort((a, b) => convertTo24Hour(a.time) - convertTo24Hour(b.time))

  // console.log(events)

  return (
    <div>
      <h2>Danh Sách Lịch trình </h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Miêu tả</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.description}</TableCell>
                <TableCell>{new Date(schedule.start_date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(schedule.end_date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDetailDialog(schedule, schedule._id)}>
                    <IconEye />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} fullWidth>
        <DialogTitle>Chi tiết lịch trình</DialogTitle>
        <DialogContent>
          <Timeline position="alternate">
            {events?.map((schedule, index) => (
              <TimelineItem key={index} position={index % 2 === 0 ? 'left' : 'right'}>
                <TimelineOppositeContent>
                  <Typography variant="caption" component="div" className="mbs-5">
                    {schedule.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="error" variant="tonal">
                    <i className="tabler-file text-xl" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent sx={{ padding: 2, maxWidth: '300px', overflowX: 'auto' }}>
                      <Typography variant="h5" className="mbe-4">
                        {/* {schedule.name} */}
                      </Typography>

                      {schedule.type === 'restaurant' && schedule.restaurant_id && (
                        <>
                          <Typography className="mbe-3">{schedule.restaurant_id.name}</Typography>
                          <Typography className="mbe-3">{schedule.restaurant_id.description}</Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              flexDirection: 'row',
                              flexWrap: 'rap',
                              marginTop: '10px',
                              overflowX: 'visible'
                            }}
                          >
                            {schedule.restaurant_id.image.map((image, index) => (
                              <Box key={index} className="flex flex-row gap-4">
                                <img height={100} src={image.url} />
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}

                      {schedule.type === 'hotel' && (
                        <>
                          <Typography className="mbe-3">{schedule.hotel_id.name}</Typography>
                          <Typography className="mbe-3">{schedule.hotel_id.address}</Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', marginTop: '10px' }}>
                            {schedule.hotel_id.image.map((image) => (
                              <Box className="flex flex-row gap-4">
                                <img height={100} src={image.url} />
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}

                      {schedule.type === 'place' && (
                        <>
                          <Typography className="mbe-3">{schedule.place_id.name}</Typography>
                          <Typography className="mbe-3">{schedule.place_id.description}</Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', marginTop: '10px' }}>
                            {schedule.place_id.image.map((image) => (
                              <Box className="flex flex-row gap-4">
                                <img height={100} src={image.url} />
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer></ToastContainer>
    </div>
  )
}
export default ScheduleManagement
