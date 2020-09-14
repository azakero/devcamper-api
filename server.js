const path 			= require('path');
const express 		= require('express');
const dotenv 		= require('dotenv');
const morgan 		= require('morgan');
const errorHandler 	= require('./middleware/error');
const connectDB 	= require('./config/db');
const colors 		= require('colors');
const fileupload 	= require('express-fileupload');
const cookieParser 	= require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet 		= require('helmet');
const xss 			= require('xss-clean');
const rateLimit 	= require('express-rate-limit');
const hpp 			= require('hpp');
const cors 			= require('cors');

// load env variables
dotenv.config();

// Connect to DB
connectDB();

// router files
const bootcamps = require('./routes/bootcamps');
const courses 	= require('./routes/courses');
const auth 		= require('./routes/auth');
const users 	= require('./routes/users');
const reviews 	= require('./routes/reviews');

const app = express();


// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// dev logging middleware
if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}


const PORT = process.env.PORT || 3000;



// File uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Prevent XSS Attacks
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100
});
app.use(limiter);

// Prevent HTTP Param Pollution
app.use(hpp());

// Enable CORS 
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);


const server = app.listen(PORT, console.log(`Server listening on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)); 


// we can handle bad rejection either by using try-catch block
// or by handling it here in the server.js file. We want to do it here
// so we need to store app.listen to a variable server. 

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process

	server.close(() => process.exit(1));
});