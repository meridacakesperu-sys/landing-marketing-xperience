import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ahf1iif4',
  api_key: '434642872356172',
  api_secret: 'mOWkrnaYU5DPidl240KR-16L8zo',
  secure: true
});

async function run() {
  try {
    const result = await cloudinary.search
      .expression('folder:samples/marketing_xperience/*')
      .sort_by('created_at', 'desc')
      .max_results(5)
      .execute();
    console.log("Found:", result.total_count);
    if(result.total_count > 0) {
      console.log(result.resources[0].secure_url);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
