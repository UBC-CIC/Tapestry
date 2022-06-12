# Tapestry

The cloud infrastructre code and deployment guide for the Graph Database version of the WordPress plugin - Tapestry ([Website](https://www.home.tapestry-tool.com/)). This is a plugin for Wordpress that allows creating non-linear, collaborative, and interactive content. Originally designed to work using a relational database, this cloud deployment alongwith the Graph Database version of the [plugin](https://github.com/UBC-CIC/tapestry-wp-graphDB) aims to use Amazon Neptune as the primary database for the plugin, which would facilitate faster graph traversals for large Tapestries.

| Index                                                 | Description                                               |
|:------------------------------------------------------|:----------------------------------------------------------| 
| [High Level Architecture](#High-Level-Architecture)   | Architecture of the Cloud Component of the plugin         |
| [Database Schema](#database-schema)                   | Graph Database Schema                                     |
| [Deployment](#deployment)                             | How to deploy the project                                 |
| [User Guides](#User-Guides)                           | The working solution                                      |
| [Changelog](#Changelog)                               | Any changes post publish                                  |
| [License](#License)                                   | License details                                           |


# High Level Architecture
The overall cloud architecture can be summarized as follows.

![Architecture1](docs/images/arch.png)

The next diagram describes the microservice architecture (API Gateway and AWS Lambda functions) in more detail.

![Architecture2](docs/images/arch2.png)

# Database Schema
The following is the schema of the graph database used in this project.

![Schema](docs/images/schema.png "Schema")

## Relational Database
Currently, the relational database stores all data in the wp tables as before. It just additionally stores all this data on Neptune as well, and in some cases, uses the post_ids or meta_ids generated to reference the data on Neptune as well. However, all data is fetched only from Neptune during a GET request. The only exception to this is Tapestry settings. Data entries that earlier had `meta_key = 'tapestry'` are now saved and loaded from the relational database with `meta_key = 'tapestry_settings'`. 

# Deployment
To deploy this solution, please follow our [Deployment Guide](docs/deployment.md).

# User Guides
For details on how to use the Tapestry plugin, visit this [guide](https://www.home.tapestry-tool.com/guides).

# Changelog
N/A

# License
This project is distributed under the [MIT License](LICENSE).
