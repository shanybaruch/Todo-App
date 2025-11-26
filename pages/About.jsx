const { useRef } = React
const { Outlet, NavLink } = ReactRouterDOM

import { utilService } from '../services/util.service.js'

export function About() {
    const titleRef = useRef()

    return (
        <section className="about">
            <h1 ref={titleRef}>About todos and us...</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio dolore sapiente, iste animi corporis nisi atque tempora assumenda dolores. Nobis nam dolorem rerum illo facilis nemo sit voluptatibus laboriosam necessitatibus!</p>
            <button onClick={() => {
                utilService.animateCSS(titleRef.current)
            }}>Animate</button>

            <nav>
                <NavLink to="/about/team">Team</NavLink> |
                <NavLink to="/about/vision">Vision</NavLink>
            </nav>

            <section>
                <Outlet />
            </section>

        </section>
    )
}
