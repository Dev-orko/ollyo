const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

// ─── Security ────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Static Files (uploads) ──────────────────────────
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsPath = isServerless ? '/tmp/uploads' : path.resolve(config.upload.dir);
app.use('/uploads', express.static(uploadsPath));

// ─── API Routes ──────────────────────────────────────
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const customerRoutes = require('./modules/customer/customer.routes');
const supplierRoutes = require('./modules/supplier/supplier.routes');
const productRoutes = require('./modules/product/product.routes');
const orderRoutes = require('./modules/order/order.routes');
const opportunityRoutes = require('./modules/opportunity/opportunity.routes');
const certificationRoutes = require('./modules/certification/certification.routes');
const complianceLogRoutes = require('./modules/complianceLog/complianceLog.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const fileUploadRoutes = require('./modules/fileUpload/fileUpload.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/compliance-logs', complianceLogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/files', fileUploadRoutes);

// ─── Health Check ────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const status = { success: true, message: 'Server is running', timestamp: new Date().toISOString() };
  try {
    const prisma = require('./config/database');
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'connected';
  } catch (err) {
    status.database = 'error: ' + err.message;
    status.success = false;
  }
  status.env = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    DATABASE_URL: process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 20) + '...)' : 'NOT SET',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ? 'set' : 'NOT SET',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'set' : 'NOT SET',
  };
  res.json(status);
});

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res, next) => {
  next(AppError.notFound(`Route ${req.originalUrl} not found`));
});

// ─── Error Handler ───────────────────────────────────
app.use(errorHandler);

module.exports = app;
