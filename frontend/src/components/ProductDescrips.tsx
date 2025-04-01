

const ProductDescrips = () => {
  return (
    <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className="flex gap-6 border-b">
            <button className="pb-2 border-b-2 border-black font-semibold">Description</button>
            <button className="pb-2 text-gray-500">Reviews (2)</button>
        </div>

      {/* Product Description */}
        <div className="mt-4 text-black text-sm space-y-4 font-semibold">
            <p>
                Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula. Fusce
                fermentum iaculis nibh, at sodales leo maximus a. Nullam ultricies sodales nunc, in pellentesque lorem mattis quis. Cras imperdiet est in nunc tristique lacinia. Nullam aliquam mauris eu
                accumsan tincidunt. Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.
            </p>
            <p>
                Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra. Maecenas lacus odio, feugiat eu nunc sit amet,
                maximus sagittis dolor. Vivamus nisi sapien, elementum sit amet eros sit amet, ultricies cursus ipsum. Sed consequat luctus ligula. Curabitur laoreet rhoncus blandit. Aenean vel diam ut
                arcu pharetra dignissim ut sed leo. Vivamus faucibus, ipsum in vestibulum vulputate, lorem orci convallis quam, sit amet consequat nulla felis pharetra lacus. Duis semper erat mauris, sed
                egestas purus commodo vel.
            </p>
        </div>    
    </div>
  )
}

export default ProductDescrips