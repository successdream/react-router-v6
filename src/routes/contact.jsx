import { Form, 
    useLoaderData, //修改：添加useFetcher
    useFetcher, 
    
} from "react-router-dom";
import { getContact, updateContact } from "../contacts1";

export async function loader({ params }) {
    const contact = await getContact(params.contactId);
    return { contact };
}
//修改：添加action
export async function action({ request, params }) {
    let formData = await request.formData();
    return updateContact(params.contactId, {
      favorite: formData.get("favorite") === "true",
    });
  }
  
  function Favorite({ contact }) {
    //修改：添加useFetcher
    const fetcher = useFetcher();
    console.log(contact, 'contact - favorite')
    let favorite = contact.favorite;

    // 修改：添加优化值
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
      }
    return (
      //修改：添加fetcher.Form
      <fetcher.Form method="post">
        <button
          name="favorite"
          value={favorite ? "false" : "true"}
          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {favorite ? "★" : "☆"}
        </button>
      </fetcher.Form>
    );
  }

export default function Contact() {
    // const contact = {
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://placekitten.com/g/200/200",
    //     twitter: "your_handle",
    //     notes: "Some notes",
    //     favorite: true,
    // };
    const { contact } = useLoaderData();
   
    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>{contact.name}</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

