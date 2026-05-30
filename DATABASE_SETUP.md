# Database Setup Instructions

## For New Team Members

### Prerequisites
- MySQL installed locally
- Node.js installed

### Setup Steps

1. **Create the database and tables:**
```bash
   mysql -u root -p < database/schema.sql
```
   
   Enter your MySQL password when prompted.

2. **Verify it worked:**
```bash
   mysql -u root -p
```
   
   Then run:
```sql
   USE complaint_routing_db;
   SHOW TABLES;
```
   
   You should see 8 tables.

3. **Update your `.env` file:**

4. **Start the server:**
```bash
   npm start
```

5. **Test the API:**