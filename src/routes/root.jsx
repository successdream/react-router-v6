
import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { useEffect, } from "react";//添加useEffect
import { getContacts, createContact } from "../contacts1";
// export async function loader() {

//     const contacts = await getContacts();
//     return { contacts };
// }


// export async function loader({ request }) {
//     const url = new URL(request.url);
//     const q = url.searchParams.get("q");
//     const contacts = await getContacts(q);
//     return { contacts };
//   }

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    const contacts = await getContacts(q);
    return { contacts, q };//添加q
}

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
    // const { contacts } = useLoaderData();
    const { contacts, q } = useLoaderData();//使用q
    const navigation = useNavigation();
    const submit = useSubmit();//添加submit
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );//添加searching
    useEffect(() => {
        document.getElementById("q").value = q;
    }, [q]);//添加useEffect
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}//添加className
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}//使用q
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                  });
                            }}//添加onChange
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                     
                            hidden={!searching}//添加hidden
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    <ul>
                        {contacts.map((contact) => (
                            <li key={contact.id}>
                                <NavLink
                                    to={`contacts/${contact.id}`}
                                    className={({ isActive, isPending }) =>
                                        isActive
                                            ? "active"
                                            : isPending
                                                ? "pending"
                                                : ""
                                    }
                                >
                                  {contact.first + contact.last}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
            >
                <Outlet />
            </div>
        </>
    );
}