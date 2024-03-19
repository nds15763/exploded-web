import Logo from './logo'

export default function Footer() {
  return (
    <footer className="pb-4">
    <div className="max-w-6xl xl:max-w-6xl mx-auto divide-y divide-gray-200 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col-reverse justify-between pt-5 pb-4 border-t lg:flex-row bg-top border-black">
        <div className="flex items-center">
          <ul className="flex space-x-5">
            <li>
              <a
                href="/terms"
                className="text-md text-black transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-md text-black transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/"
                className="text-md text-black transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
              >
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
        <ul className="flex mb-3 space-x-5">
          <li>
            <a
              href="/"
              className="text-md text-black transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold tracking-tight"
            >
              © 2024 Exploded Inc.
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
  
  )
}
