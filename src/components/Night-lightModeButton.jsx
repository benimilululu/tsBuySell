import React from 'react';

export default function Night_LightModeButton({ nightMode, setNightMode }) {
  return (
    <div>
      <div className='flex relative'>
        <label htmlFor='toggle ' className='mt-2'>
          <input
            className='w-full'
            type='checkbox'
            checked={!nightMode && 'checked'}
            onClick={() => setNightMode(!nightMode)}
          />
          {/* </label> */}

          <svg viewBox='0 0 100 45' width='90' height='28'>
            <defs>
              {/* <!-- rectangle used for the background and re-used in the clip and mask elements --> */}
              <rect
                id='background'
                x='0'
                y='0'
                width='90'
                height='40'
                rx='20'
              ></rect>
              {/* <!-- clip cutting out the elements exceeding the rounded rectangle --> */}
              <clipPath id='clip'>
                <use href='#background'></use>
              </clipPath>
              {/* <!-- for the light variant --> */}
              {/* <!-- gradient used for the background --> */}
              <linearGradient id='gradient-light' x1='0' x2='0' y1='0' y2='1'>
                <stop stopColor='#8bc8f2' offset='0'></stop>
                <stop stopColor='#fff' offset='1'></stop>
              </linearGradient>
              ;
              {/* <!-- filter applied to (a copy of) the sun to blur the edges --> */}
              <filter id='blur-light'>
                <feGaussianBlur stdDeviation='1'></feGaussianBlur>
              </filter>
              ;{/* <!-- pattern for the waves --> */}
              <pattern
                id='pattern-light'
                width='0.1'
                height='1'
                viewBox='0 0 10 45'
              >
                <path
                  fill='#40b5f8'
                  d='M 0 0 a 6 6 0 0 0 10 0 v 45 h -10 z'
                ></path>
              </pattern>
              ;{/* <!-- for the dark variant --> */}
              {/* <!-- gradient used for the background --> */}
              <linearGradient id='gradient-dark' x1='0' x2='0' y1='0' y2='1'>
                <stop stopColor='#1F2241' offset='0'></stop>
                <stop stopColor='#7D59DF' offset='1'></stop>
              </linearGradient>
              ;{/* <!-- gradient used for the the mask */}
              {/* the idea is to have the mask use the [#000-#fff] gradient to progressively hide the shapes as they approach the bottom */}
              {/* --> */}
              <linearGradient id='gradient-mask' x1='0' x2='0' y1='0' y2='1'>
                <stop stopColor='#000' offset='0'></stop>
                <stop stopColor='#fff' offset='1'></stop>
              </linearGradient>
              {/* <!-- mask to conceal the stars at the bottom of the toggle --> */}
              <mask id='mask-dark'>
                <use fill='url(#gradient-mask)' href='#background'></use>
              </mask>
              {/* <!-- gradients for the moon and craters --> */}
              <radialGradient id='gradient-moon'>
                <stop stopColor='#fdfdfd' offset='0.7'></stop>
                <stop stopColor='#e2e2e2' offset='1'></stop>
              </radialGradient>
              <radialGradient id='gradient-crater'>
                <stop stopColor='#e0e0e0' offset='0'></stop>
                <stop stopColor='#d9d9d9' offset='1'></stop>
              </radialGradient>
              {/* <!-- pattern for the stars --> */}
              <pattern
                id='pattern-dark'
                width='0.2'
                height='1'
                viewBox='0 0 20 45'
              >
                <path fill='#fff' d='M 2 5 l 1 1 l -1 1 l -1 -1 l 1 -1'></path>
                <path
                  fill='#fff'
                  d='M 10 16 l 1 1 l -1 1 l -1 -1 l 1 -1'
                ></path>
                <path
                  fill='#fff'
                  d='M 16 27 l 1 1 l -1 1 l -1 -1 l 1 -1'
                ></path>
                <path
                  fill='#fff'
                  d='M 10 38 l 1 1 l -1 1 l -1 -1 l 1 -1'
                ></path>
              </pattern>
            </defs>

            {/* <!-- actual graphics
        the idea is to include the elements for the light variant on top of the dark counterpart and change the opacity when the input is toggled
        ! beside changing the opacity of the .light elements the transition also affects the position of the sun/moon and of the patterns
    --> */}
            <g transform='translate(5 2.5) '>
              <g clipPath='url(#clip)'>
                <g className='dark'>
                  <use fill='url(#gradient-dark)' href='#background'></use>
                  {/* translate the stars above the toggle
                ! the change in y scale allows to transition the stars with a faster pace (see the CSS) */}

                  <g
                    className='background'
                    transform='translate(0 -40) scale(1 0.4)'
                  >
                    <rect
                      transform='translate(-40 0) rotate(4)'
                      fill='url(#pattern-dark)'
                      x='0'
                      y='0'
                      width='100'
                      height='45'
                    ></rect>
                  </g>
                  <use
                    mask='url(#mask-dark)'
                    fill='url(#gradient-dark)'
                    href='#background'
                  ></use>
                </g>
                <g className='light'>
                  <use fill='url(#gradient-light)' href='#background'></use>
                  {/* <!-- translate the waves above the toggle and reset their position with an opposite translation
                by translating the first group to 0 (alongside the stars) the waves are pushed below
                --> */}
                  <g className='background' transform='translate(-30 -20)'>
                    <g transform='translate(30 20)'>
                      <rect
                        fill='url(#pattern-light)'
                        x='-5'
                        y='27.5'
                        width='100'
                        height='45'
                      ></rect>
                    </g>
                  </g>
                </g>
              </g>
            </g>

            <g transform='translate(77.5 22.5)'>
              {/* <!-- translate this group to move the sun/moon to the right --> */}
              <g
                className='translate'
                transform='translate(-55)'
              >
                {/* <!-- rotate this group to rotate the moon --> */}
                <g className='rotate' transform='rotate(-100)'>
                  <g className='dark'>
                    <circle
                      fill='url(#gradient-moon)'
                      cx='0'
                      cy='0'
                      r='20.5'
                    ></circle>
                    <g transform='translate(-8 -7.5)'>
                      <ellipse
                        transform='rotate(-30)'
                        fill='url(#gradient-crater)'
                        stroke='#d5d5d5'
                        strokeWidth='0.2'
                        cx='0'
                        cy='0'
                        rx='4'
                        ry='3'
                      ></ellipse>
                    </g>
                    <g transform='translate(11 5)'>
                      <ellipse
                        fill='url(#gradient-crater)'
                        stroke='#d5d5d5'
                        strokeWidth='0.2'
                        cx='0'
                        cy='0'
                        rx='3.85'
                        ry='4'
                      ></ellipse>
                    </g>
                    <g transform='translate(-6 12)'>
                      <ellipse
                        transform='rotate(-10)'
                        fill='url(#gradient-crater)'
                        stroke='#d5d5d5'
                        strokeWidth='0.2'
                        cx='0'
                        cy='0'
                        rx='2'
                        ry='1.75'
                      ></ellipse>
                    </g>
                  </g>
                </g>
                <g className='light'>
                  <circle
                    fill='#FFD21F'
                    cx='0'
                    cy='0'
                    r='21'
                    filter='url(#blur-light)'
                  ></circle>
                  <circle fill='#FFD21F' cx='0' cy='0' r='20.5'></circle>
                </g>
              </g>
            </g>
          </svg>
        </label>
      </div>
    </div>
  );
}
