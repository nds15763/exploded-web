export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      <div className="fixed inset-0 overflow-hidden opacity-75 bg-[#f8fafb]">
      <img
          alt="World Map"
          src="./public/map.svg"  // 直接引用 public 文件夹中的图像
          style={{
            objectFit: 'cover', // 使用内联样式来应用 object-fit
            width: '100%',     // 使图像填充其父容器
            height: '100%'
          }}
        />
      </div>
    </div>
  );
}
