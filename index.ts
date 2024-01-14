import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import sequelize from "./app/model/dbconfig";
import Link from "./app/model/link";

sequelize.sync({ force: true }).then(async () => {
  console.log("db is ready...");
});

const app = express();
app.use(express.json());
app.use(express.static('public'))

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO: we can choose a client engine later if we want (mainly for interpolation)
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const links = await Link.findAndCountAll();
  return res.render("index", { links: links.rows });
});

app.post("/submit", async (req, res) => {
  const link = {
    title: req.body.title,
    url: req.body.url,
  };
  await Link.create(link).then((x) => {
    // send id of recently created item
    return res.send(`<tr>
    <td><a href="${req.body.url}">${req.body.title}</a></td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${x.id}">
            Edit Link
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${x.id}}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`);
  });
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Link.findOne({ where: { id: id } }).then((link) => {
    link?.destroy();
    return res.send("");
  });
});

app.get("/get-link-row/:id", async (req, res) => {
  const id = req.params.id;
  await Link.findOne({ where: { id: id } }).then((link) => {
    return res.send(`<tr>
    <td>${link?.title}</td>
    <td>${link?.url}</td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${id}">
            Edit link
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${id}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`);
  });
});

app.get("/get-edit-form/:id", async (req, res) => {
  const id = req.params.id;
  await Link.findOne({ where: { id: id } }).then((link) => {
    return res.send(`<tr hx-trigger='cancel' class='editing' hx-get="/get-link-row/${id}">
    <td><input name="title" value="${link?.title}"/></td>
    <td><input name="url" value="${link?.url}"/></td>
    <td>
      <button class="btn btn-primary" hx-get="/get-link-row/${id}">
        Cancel
      </button>
      <button class="btn btn-primary" hx-put="/update/${id}" hx-include="closest tr">
        Save
      </button>
    </td>
  </tr>`);
  });
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  // update link
  await Link.findByPk(id).then((item) => {
    item?.update({
        title: req.body.title,
        url: req.body.url,
      })
      .then(() => {
        return res.send(`<tr>
        <td><a href="${req.body.url}">${req.body.title}</a></td>
    <td>
        <button class="btn btn-primary"
            hx-get="/get-edit-form/${id}">
            Edit Link
        </button>
    </td>
    <td>
        <button hx-delete="/delete/${id}"
            class="btn btn-primary">
            Delete
        </button>
    </td>
</tr>`);
      });
  });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service endpoint = http://localhost:${PORT}`);
});